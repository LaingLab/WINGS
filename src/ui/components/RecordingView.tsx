import { useEffect, useRef, useState } from "react";
import { CameraOff } from "lucide-react";
import RecordRTC from "recordrtc";

const RecordingView = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function fetchDevices() {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(mediaDevices.filter((device) => device.kind === "videoinput"));
    }
    fetchDevices();
  }, []);

  useEffect(() => {
    const startPreview = async () => {
      if (!selectedDevice) return;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice,
          width: { min: 1280, ideal: 1920, max: 1920 },
          height: { min: 720, ideal: 1080, max: 1080 },
          frameRate: { min: 30, ideal: 60 },
          aspectRatio: { ideal: 16 / 9 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    };
    startPreview();
  }, [selectedDevice]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
    };
  }, []);

  const handleSelectOutputFolder = async () => {
    const path = await (window as any).electronIPC.recording(
      "select-output-folder",
    );
    if (path) setOutputPath(path);
  };

  const handleStartRecording = async () => {
    if (!selectedDevice || !outputPath || !streamRef.current) {
      alert("Please select a camera and output path first.");
      return;
    }

    try {
      recorderRef.current = new RecordRTC(streamRef.current, {
        type: "video",
        mimeType: "video/mp4",
        recorderType: RecordRTC.MediaStreamRecorder,
        bitsPerSecond: 5100000,
        videoBitsPerSecond: 12000000,
        frameInterval: 1,
        disableLogs: true,
        timeSlice: 1000,
        checkForInactiveTracks: true,
        canvas: {
          width: 1920,
          height: 1080,
        },
      });

      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error: any) {
      console.error("Failed to start recording:", error);
      alert(`Recording failed: ${error.message}`);
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current) {
      alert("No recording in progress");
      return;
    }

    try {
      return new Promise<void>((resolve) => {
        recorderRef.current!.stopRecording(async () => {
          const blob = recorderRef.current!.getBlob();
          const arrayBuffer = await blob.arrayBuffer();
          const result = await (window as any).electronIPC.recording(
            "save-recording-file",
            { filePath: outputPath, data: arrayBuffer },
          );

          if (result.success) {
            setIsRecording(false);
            alert(`Video saved: ${result.filePath}`);
          } else {
            alert(`Failed to save video: ${result.message}`);
          }

          recorderRef.current = null;
          resolve();
        });
      });
    } catch (error: any) {
      console.error("Failed to stop recording:", error);
      alert(`Failed to stop recording: ${error.message}`);
    }
  };

  return (
    <div className="flex w-full items-start justify-between gap-3">
      <div className="bg-bg1 flex aspect-video w-[960px] items-center justify-center rounded-xl border border-white/20">
        {selectedDevice ? (
          <video
            ref={videoRef}
            className="w-[960px] rounded-xl"
            autoPlay
            playsInline
          />
        ) : (
          <CameraOff size={160} className="text-neutral-800" />
        )}
      </div>

      <div>
        <div className="bg-bg1 flex w-96 flex-col gap-3 rounded-xl border border-white/20 p-4">
          <select
            className="bg-bg rounded-md border border-white/20 bg-neutral-800 p-2.5 text-white duration-150"
            onChange={(e) => setSelectedDevice(e.target.value)}
            value={selectedDevice || ""}
            disabled={isRecording}
          >
            <option value="" disabled>
              Select a camera
            </option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>

          <button
            className="rounded-md border border-white/20 bg-neutral-800 px-4 py-2 text-white duration-150 hover:bg-neutral-800/50"
            onClick={handleSelectOutputFolder}
            disabled={isRecording}
          >
            Choose Save Location
          </button>
          <div className="flex gap-2">
            {!isRecording ? (
              <button
                className="w-full rounded-md border border-white/20 bg-green-700 px-4 py-2 text-white duration-150 hover:bg-green-700/50"
                onClick={handleStartRecording}
              >
                Start Recording
              </button>
            ) : (
              <button
                className="w-full rounded border border-white/20 bg-red-500 px-4 py-2 text-white duration-150 hover:bg-red-500/50"
                onClick={handleStopRecording}
              >
                Stop Recording
              </button>
            )}
          </div>
        </div>
        {outputPath && (
          <p className="w-96 p-5 text-sm break-all text-white">
            <strong>Saving to:</strong> {JSON.stringify(outputPath)}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecordingView;
