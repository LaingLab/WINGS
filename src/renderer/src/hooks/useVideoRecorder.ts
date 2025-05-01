import { isRecordingAtom, trialDataAtom } from '@/store'
import { useAtom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import { useCallback, useEffect, useRef, useState } from 'react'

const QUALITY_OPTIONS = {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 8000000, // 8 Mbps
  audioBitsPerSecond: 128000 // 128 kbps
}

interface UseVideoRecorderProps {
  stream: MediaStream | null
  videoDeviceId: string | null
}

export const useVideoRecorder = ({ stream, videoDeviceId }: UseVideoRecorderProps) => {
  const [isRecording, setIsRecording] = useAtom(isRecordingAtom)
  const [trialData, setTrialData] = useImmerAtom(trialDataAtom)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIdRef = useRef<string | null>(null)
  const [recordingStats, setRecordingStats] = useState({ chunks: 0, size: 0 })

  const startRecording = useCallback(async () => {
    if (!stream || !videoDeviceId) {
      console.error('[Recorder] Cannot start recording: stream or device ID not available')
      return false
    }

    if (mediaRecorderRef.current) {
      console.warn('[Recorder] Recording already in progress')
      return false // Already recording
    }

    try {
      const { recordingId, filePath } = await window.context.startRecording()
      recordingIdRef.current = recordingId
      console.log(`[Recorder] Starting recording to ${filePath}`)

      const options = { ...QUALITY_OPTIONS }
      mediaRecorderRef.current = new MediaRecorder(stream, options)

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && recordingIdRef.current) {
          try {
            const buffer = await event.data.arrayBuffer()
            const result = await window.context.writeVideoChunk({
              recordingId: recordingIdRef.current,
              chunk: buffer
            })
            setRecordingStats((prev) => ({
              chunks: result.chunksWritten,
              size: prev.size + buffer.byteLength
            }))
          } catch (error) {
            console.error('[Recorder] Failed to write video chunk:', error)
            // Optionally stop recording here if writing fails
          }
        }
      }

      mediaRecorderRef.current.start(1000) // Data update rate (1 second)
      setIsRecording(true)
      setTrialData((draft) => {
        draft.videoPath = filePath // Store the final path
      })
      console.log('[Recorder] Recording started:', filePath)
      return true
    } catch (error) {
      console.error('[Recorder] Failed to start recording:', error)
      setIsRecording(false)
      recordingIdRef.current = null // Reset on failure
      mediaRecorderRef.current = null
      return false
    }
  }, [stream, videoDeviceId, setIsRecording, setTrialData])

  const stopRecording = useCallback(async (): Promise<boolean> => {
    if (!mediaRecorderRef.current || !recordingIdRef.current) {
      console.warn('[Recorder] Stop called but no active recording found.')
      return false
    }

    const currentRecorder = mediaRecorderRef.current
    const currentRecordingId = recordingIdRef.current

    // Prevent multiple stop calls
    mediaRecorderRef.current = null
    recordingIdRef.current = null

    return new Promise<boolean>((resolve) => {
      currentRecorder.onstop = async () => {
        try {
          const result = await window.context.stopRecording({
            recordingId: currentRecordingId
          })
          setIsRecording(false)
          console.log(`[Recorder] Recording saved to ${result.filePath}`)
          console.log(
            `[Recorder] Recorded ${result.totalChunks} chunks, size: ${Math.round(recordingStats.size / 1024 / 1024)}MB`
          )
          setRecordingStats({ chunks: 0, size: 0 }) // Reset stats
          resolve(true)
        } catch (err) {
          console.error('[Recorder] Error finalizing recording:', err)
          setIsRecording(false) // Ensure state is updated even on error
          setRecordingStats({ chunks: 0, size: 0 })
          resolve(false)
        }
      }

      currentRecorder.onerror = (event) => {
        console.error('[Recorder] MediaRecorder error:', event)
        setIsRecording(false)
        setRecordingStats({ chunks: 0, size: 0 })
        // Attempt to stop via IPC even if recorder errored
        window.context
          .stopRecording({ recordingId: currentRecordingId })
          .catch((ipcErr) =>
            console.error('[Recorder] IPC stop failed after recorder error:', ipcErr)
          )
        resolve(false)
      }

      // Request last data chunk before stopping
      if (currentRecorder.state === 'recording') {
        currentRecorder.requestData()
        currentRecorder.stop()
      } else {
        console.warn('[Recorder] Recorder was not in recording state during stop.')
        // If not recording, attempt cleanup via IPC anyway
        window.context
          .stopRecording({ recordingId: currentRecordingId })
          .then(() => resolve(true))
          .catch((err) => {
            console.error('[Recorder] IPC stop failed when recorder was not active:', err)
            resolve(false)
          })
          .finally(() => {
            setIsRecording(false)
            setRecordingStats({ chunks: 0, size: 0 })
          })
      }
    })
  }, [setIsRecording, recordingStats.size]) // Dependencies: state setters and stats

  // Effect to listen for external control signals (e.g., from main process)
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

  return { isRecording, recordingStats, startRecording, stopRecording }
}
