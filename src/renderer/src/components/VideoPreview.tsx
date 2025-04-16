import { isRecordingAtom, tempTrialInfoAtom } from '@/store'
import { useAtom, useAtomValue } from 'jotai'
import { CameraOff } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const QUALITY_OPTIONS = {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 8000000, // 8 Mbps
  audioBitsPerSecond: 128000 // 128 kbps
}

export const VideoPreview = () => {
  const { videoInfo } = useAtomValue(tempTrialInfoAtom)
  const [isRecording, setIsRecording] = useAtom(isRecordingAtom)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordingIdRef = useRef<string | null>(null)
  const [recordingStats, setRecordingStats] = useState({ chunks: 0, size: 0 })

  useEffect(() => {
    const startPreview = async () => {
      if (!videoInfo.path) return

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: videoInfo.path,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 }
          },
          audio: false // Marking to remember for audio
        })

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Failed to access camera:', err)
      }
    }

    startPreview()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoInfo.path])

  const startRecording = useCallback(async () => {
    if (!streamRef.current || !videoInfo.fileName) {
      console.error('Cannot start recording: stream or filename not available')
      return false
    }

    try {
      const { recordingId, filePath } = await window.context.startRecording({
        fileName: videoInfo.fileName,
        outputFolder: videoInfo.outputFolder,
        format: videoInfo.fileName.split('.').pop() || 'webm'
      })

      recordingIdRef.current = recordingId
      console.log(`Starting recording to ${filePath}`)

      const options = { ...QUALITY_OPTIONS }
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options)

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && recordingIdRef.current) {
          const buffer = await event.data.arrayBuffer()
          const result = await window.context.writeVideoChunk({
            recordingId: recordingIdRef.current,
            chunk: buffer
          })

          setRecordingStats((prev) => ({
            chunks: result.chunksWritten,
            size: prev.size + buffer.byteLength
          }))
        }
      }

      mediaRecorderRef.current.start(1000) // Data update rate
      setIsRecording(true)

      return true
    } catch (error) {
      console.error('Failed to start recording:', error)
      return false
    }
  }, [videoInfo, streamRef, setIsRecording])

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !recordingIdRef.current) {
      return false
    }

    try {
      return new Promise<boolean>((resolve) => {
        mediaRecorderRef.current!.onstop = async () => {
          try {
            const result = await window.context.stopRecording({
              recordingId: recordingIdRef.current!
            })

            setIsRecording(false)
            console.log(`Recording saved to ${result.filePath}`)
            console.log(
              `Recorded ${result.totalChunks} chunks, approximately ${Math.round(recordingStats.size / 1024 / 1024)}MB`
            )

            mediaRecorderRef.current = null
            recordingIdRef.current = null
            setRecordingStats({ chunks: 0, size: 0 })

            resolve(true)
          } catch (err) {
            console.error('Error finalizing recording:', err)
            resolve(false)
          }
        }

        mediaRecorderRef.current!.requestData()
        mediaRecorderRef.current!.stop()
      })
    } catch (error) {
      console.error('Failed to stop recording:', error)
      return false
    }
  }, [mediaRecorderRef, recordingIdRef, setIsRecording])

  useEffect(() => {
    const handleVideoControl = (command: string) => {
      if (command === 'start-recording') {
        startRecording()
      } else if (command === 'stop-recording') {
        stopRecording()
      }
    }
    const unsubscribe = window.context.onVideoControl(handleVideoControl)
    return () => unsubscribe()
  }, [startRecording, stopRecording])

  return (
    <>
      {videoInfo.path ? (
        <div className="relative h-full w-full">
          <video
            ref={videoRef}
            className="h-full w-full rounded-xl object-cover"
            autoPlay
            playsInline
            muted
          />
          {isRecording && (
            <div className="absolute top-2 right-2 flex items-center rounded-md bg-red-500 px-2 py-1 text-xs text-white">
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-white" />
              Recording {/** recordingStats.chunks > 0 && `(${recordingStats.chunks} chunks)` */}
            </div>
          )}
        </div>
      ) : (
        <CameraOff size={80} className="text-neutral-800" />
      )}
    </>
  )
}
