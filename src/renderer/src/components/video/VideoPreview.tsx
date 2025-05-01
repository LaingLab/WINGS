import { useVideoRecorder } from '@/hooks/useVideoRecorder' // Import the new hook
import { tempTrialInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { CameraOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const VideoPreview = () => {
  const {
    settings: { video: videoInfo }
  } = useAtomValue(tempTrialInfoAtom)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Use the custom hook for recording logic
  const { isRecording, recordingStats } = useVideoRecorder({
    stream,
    videoDeviceId: videoInfo.path
  })

  // Effect to manage the camera stream based on selected device
  useEffect(() => {
    // Use a variable within the effect scope to track the current stream
    let currentStream: MediaStream | null = null

    const startPreview = async () => {
      // Stop any previous stream cleanly before starting a new one
      if (videoRef.current && videoRef.current.srcObject) {
        const existingStream = videoRef.current.srcObject as MediaStream
        existingStream.getTracks().forEach((track) => track.stop())
        console.log('[Preview] Stopped previous stream tracks.')
      }
      // Clear the video source and state
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setStream(null)

      // If no device is selected, exit early
      if (!videoInfo.path) {
        console.log('[Preview] No video device selected.')
        return
      }

      try {
        console.log(`[Preview] Attempting to get stream for device: ${videoInfo.path}`)
        // Request the new stream
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: videoInfo.path,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 }
          },
          audio: false // Keep audio disabled for now
        })
        currentStream = newStream // Assign to the effect-scoped variable
        setStream(newStream) // Update the state for the hook

        // Assign the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = newStream
          // Optional: Explicitly try to play, though autoPlay should handle it
          videoRef.current.play().catch((e) => console.error('[Preview] Video play failed:', e))
          console.log('[Preview] Assigned new stream to video element.')
        } else {
          console.warn('[Preview] videoRef.current was null when stream was ready.')
        }
      } catch (err) {
        console.error('[Preview] Failed to access camera:', err)
        setStream(null) // Clear stream state on error
        if (videoRef.current) {
          videoRef.current.srcObject = null // Clear video source on error
        }
        // Stop tracks if stream was partially obtained before error
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop())
        }
      }
    }

    startPreview()

    // Cleanup function: Stops the tracks of the stream created in *this* effect run
    return () => {
      console.log('[Preview] Cleanup effect running.')
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop())
        console.log('[Preview] Stopped stream tracks in cleanup.')
      }
      // Also clear the video element source on cleanup
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
    // Rerun effect ONLY when the video device path changes.
    // Removing `stream` prevents the effect from rerunning when setStream is called.
  }, [videoInfo.path])

  return (
    <>
      {videoInfo.path ? (
        <div className="relative h-full w-full">
          <video
            ref={videoRef}
            className="h-full w-full rounded-xl object-cover"
            autoPlay
            playsInline
            muted // Keep preview muted
          />
          {isRecording && (
            <div className="absolute top-2 right-2 flex items-center rounded-md bg-red-500 px-2 py-1 text-xs text-white">
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-white" />
              Recording{' '}
              {recordingStats.chunks > 0 &&
                `(${recordingStats.chunks} chunks, ${Math.round(recordingStats.size / 1024)} KB)`}
            </div>
          )}
        </div>
      ) : (
        // Display placeholder if no camera is selected
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-neutral-200">
          <CameraOff size={60} className="text-neutral-500" />
        </div>
      )}
    </>
  )
}
