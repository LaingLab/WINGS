import { isRecordingAtom, outputPathAtom, selectedMediaDeviceAtom } from '@/store'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CameraOff } from 'lucide-react'
import { useEffect, useRef } from 'react'
import RecordRTC from 'recordrtc'

export const VideoPreview = () => {
  const [outputPath, setOutputPath] = useAtom(outputPathAtom)
  const selectedDevice = useAtomValue(selectedMediaDeviceAtom)
  const setIsRecording = useSetAtom(isRecordingAtom)
  const videoRef = useRef<HTMLVideoElement>(null)
  const recorderRef = useRef<RecordRTC | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const startPreview = async () => {
      if (!selectedDevice) return

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice,
          width: { min: 1280, ideal: 1920, max: 1920 },
          height: { min: 720, ideal: 1080, max: 1080 },
          frameRate: { min: 30, ideal: 60 },
          aspectRatio: { ideal: 16 / 9 }
        }
      })

      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    }
    startPreview()
  }, [selectedDevice])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (recorderRef.current) {
        recorderRef.current.destroy()
      }
    }
  }, [])

  const handleSelectOutputFolder = async () => {
    const path = await (window as any).electronIPC.recording('select-output-folder')
    if (path) setOutputPath(path)
  }

  const handleStartRecording = async () => {
    if (!selectedDevice || !outputPath || !streamRef.current) {
      alert('Please select a camera and output path first.')
      return
    }

    try {
      recorderRef.current = new RecordRTC(streamRef.current, {
        type: 'video',
        mimeType: 'video/mp4',
        recorderType: RecordRTC.MediaStreamRecorder,
        bitsPerSecond: 5100000,
        videoBitsPerSecond: 12000000,
        frameInterval: 1,
        disableLogs: true,
        timeSlice: 1000,
        checkForInactiveTracks: true,
        canvas: {
          width: 1920,
          height: 1080
        }
      })

      recorderRef.current.startRecording()
      setIsRecording(true)
    } catch (error: any) {
      console.error('Failed to start recording:', error)
      alert(`Recording failed: ${error.message}`)
    }
  }

  const handleStopRecording = async () => {
    if (!recorderRef.current) {
      alert('No recording in progress')
      return
    }

    try {
      return new Promise<void>((resolve) => {
        recorderRef.current!.stopRecording(async () => {
          const blob = recorderRef.current!.getBlob()
          const arrayBuffer = await blob.arrayBuffer()
          const result = await (window as any).electronIPC.recording('save-recording-file', {
            filePath: outputPath,
            data: arrayBuffer
          })

          if (result.success) {
            setIsRecording(false)
            alert(`Video saved: ${result.filePath}`)
          } else {
            alert(`Failed to save video: ${result.message}`)
          }

          recorderRef.current = null
          resolve()
        })
      })
    } catch (error: any) {
      console.error('Failed to stop recording:', error)
      alert(`Failed to stop recording: ${error.message}`)
    }
  }

  return (
    <>
      {selectedDevice ? (
        <video ref={videoRef} className="w-[960px] rounded-xl" autoPlay playsInline />
      ) : (
        <CameraOff size={80} className="text-neutral-800" />
      )}
    </>
  )
}
