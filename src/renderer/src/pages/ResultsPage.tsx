import { useResults } from '@renderer/hooks/useResults'
import { trialResultsAtom } from '@renderer/store'
import { Log } from '@shared/models'
import { useAtom } from 'jotai'
import { ArrowLeft, CameraOff, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'

// Extract start time (ms) from filename like rec-<timestamp>.webm
const getStartTime = (path: string): number | null => {
  const m = path.match(/rec-(\d+)\.webm$/)
  return m ? parseInt(m[1], 10) : null
}

export const ResultsPage = () => {
  const [trialResults, setTrialResults] = useAtom(trialResultsAtom)
  const { id } = useParams()

  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [videoStartTime, setVideoStartTime] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useResults()

  useEffect(() => {
    const startTime = getStartTime(trialResults?.trialInfo.settings.video.path ?? '')
    setVideoStartTime(startTime ?? 0)
  }, [])

  // Enhanced metadata loading to ensure we properly get the duration
  const onLoadedMetadata = () => {
    if (!videoRef.current) return

    // Initially try to get metadata
    const videoDuration = videoRef.current.duration
    console.log(`Initial video duration: ${videoDuration}`)

    // If the duration is valid already, use it
    if (isFinite(videoDuration) && videoDuration > 0 && videoDuration < 3600) {
      console.log(`Setting valid duration: ${videoDuration}`)
      setDuration(videoDuration)
      return
    }

    // The duration isn't available or is invalid, so let's set up event listeners
    const handleDurationChange = () => {
      if (!videoRef.current) return

      const newDuration = videoRef.current.duration
      console.log(`Duration changed: ${newDuration}`)

      if (isFinite(newDuration) && newDuration > 0 && newDuration < 3600) {
        console.log(`Setting duration from change event: ${newDuration}`)
        setDuration(newDuration)
        videoRef.current.removeEventListener('durationchange', handleDurationChange)
      }
    }

    // Set up a backup timeout in case the event doesn't fire
    const attemptReadDuration = () => {
      if (!videoRef.current) return

      // Try to force the video to load enough to get duration
      if (videoRef.current.readyState >= 1) {
        const readyDuration = videoRef.current.duration
        console.log(`ReadyState ${videoRef.current.readyState}, duration: ${readyDuration}`)

        if (isFinite(readyDuration) && readyDuration > 0 && readyDuration < 3600) {
          console.log(`Setting duration from readyState: ${readyDuration}`)
          setDuration(readyDuration)
          videoRef.current.removeEventListener('durationchange', handleDurationChange)
          return
        }
      }

      // If we still don't have a valid duration, try to calculate it based on the file size
      console.log(`Unable to get valid duration automatically`)

      // As a last resort, try seeking to the end to force duration calculation
      try {
        videoRef.current.currentTime = 1000 // Try seeking to a far position
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0 // Reset to beginning
            const seekDuration = videoRef.current.duration

            if (isFinite(seekDuration) && seekDuration > 0 && seekDuration < 3600) {
              console.log(`Setting duration after seek: ${seekDuration}`)
              setDuration(seekDuration)
            }
          }
        }, 500)
      } catch (err) {
        console.error('Error during seek test:', err)
        setDuration(20) // Default to 20 seconds
      }
    }

    // Add duration change listener
    videoRef.current.addEventListener('durationchange', handleDurationChange)

    // Try after a delay as backup
    setTimeout(attemptReadDuration, 1000)
  }

  const onTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)

    // If this is the first timeupdate and duration is still not properly set,
    // check if we can get a better duration now
    if (duration > 100 && videoRef.current.duration < 100) {
      console.log(`Updating duration from timeupdate: ${videoRef.current.duration}`)
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (t: number) => {
    if (!videoRef.current || !isFinite(t)) return

    // Make sure we don't seek past the end
    const safeTime = Math.min(t, duration || 100)

    try {
      videoRef.current.currentTime = safeTime
      setCurrentTime(safeTime)
    } catch (err) {
      console.error('Error seeking video:', err)
    }
  }

  // Format time as mm:ss
  const formatTime = (timeInSeconds: number): string => {
    if (!timeInSeconds || !isFinite(timeInSeconds)) {
      return '00:00'
    }
    // Cap at reasonable values
    const capped = Math.min(timeInSeconds, 3600)
    const minutes = Math.floor(capped / 60)
    const seconds = Math.floor(capped % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Error playing video:', err)
          setIsPlaying(false)
        })
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Listen for play/pause events on the video element
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    videoElement.addEventListener('play', onPlay)
    videoElement.addEventListener('pause', onPause)

    return () => {
      videoElement.removeEventListener('play', onPlay)
      videoElement.removeEventListener('pause', onPause)
    }
  }, [videoRef.current])

  if (!trialResults) {
    return (
      <div className="flex h-screen flex-col p-4">
        <div className="mb-2 flex w-full items-center gap-4">
          <Link
            to={`/trial/${id}`}
            className="rounded-full bg-white p-1 text-black duration-150 hover:bg-white/50"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-3xl font-medium">Trial Results</h1>
        </div>
        <p className="text-white/40">Run a trial to get some results...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <div className="mb-2 flex w-full items-center gap-4">
        <Link
          to={`/trial/${id}`}
          className="rounded-full bg-white p-1 text-black duration-150 hover:bg-white/50"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-3xl font-medium">Trial Results</h1>
      </div>

      <div className="flex h-full min-h-0 gap-4">
        <div className="flex w-1/2 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Video</h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
              {trialResults.trialData.videoPath ? (
                <>
                  <video
                    ref={videoRef}
                    src={`file://${trialResults.trialData.videoPath}`}
                    className="h-full w-full object-contain"
                    preload="auto"
                    playsInline
                    onLoadedMetadata={onLoadedMetadata}
                    onTimeUpdate={onTimeUpdate}
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlayPause}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/80"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <div className="text-sm text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          step="0.01"
                          value={currentTime}
                          onChange={(e) => handleSeek(parseFloat(e.target.value))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                          style={{
                            background: `linear-gradient(to right, #ffffff ${
                              (currentTime / (duration || 1)) * 100
                            }%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
                          }}
                        />
                        {/* Event markers */}
                        {trialResults.trialData.events.map((event, i) => {
                          if (!videoStartTime) return null
                          const eventTime = new Date(event.time).getTime()
                          const videoTime = videoStartTime
                          const offsetSeconds = (eventTime - videoTime) / 1000

                          if (offsetSeconds < 0 || offsetSeconds > duration) return null

                          const position = (offsetSeconds / duration) * 100
                          return (
                            <div
                              key={i}
                              className="absolute top-0 h-2 w-1 -translate-x-1/2 bg-red-500 hover:bg-red-300"
                              style={{ left: `${position}%` }}
                              title={`${event.type} at ${formatTime(offsetSeconds)}`}
                              onClick={() => handleSeek(offsetSeconds)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <CameraOff size={80} className="text-neutral-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-1">
            <p className="text-xl font-semibold">Logs</p>
            <div className="min-h-0 min-w-0 flex-1 rounded-xl border border-white/20 bg-neutral-900 p-2 text-sm">
              <div className="h-full overflow-y-auto pr-1">
                {trialResults.trialData.logs?.map((log: Log, index) => (
                  <p key={index}>
                    <span className="text-sm text-white/60">[{log.time}]</span>{' '}
                    <span className="text-sm text-blue-500/60">[{log.type}]</span>{' '}
                    <span className="break-words">{log.data}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="text-xl font-semibold">Sensor Readings</h2>
            <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-white/20 bg-neutral-900 p-2">
              <p className="text-white/40">No sensor readings found</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Events</h2>
            <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-white/20 bg-neutral-900 p-2">
              {trialResults.trialData.events?.length > 0 ? (
                trialResults.trialData.events.map((ev, index) => (
                  <div key={index} className="border-b border-white/10 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <strong>{ev.time}</strong>
                      {videoStartTime && (
                        <button
                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-500"
                          onClick={() => {
                            if (!videoRef.current || !videoStartTime) return
                            const eventTime = new Date(ev.time).getTime()
                            const videoTime = videoStartTime
                            const offsetSeconds = (eventTime - videoTime) / 1000
                            handleSeek(offsetSeconds)
                            videoRef.current.play()
                          }}
                        >
                          Jump to event
                        </button>
                      )}
                    </div>
                    <div>
                      {ev.data} ({ev.type})
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/40">No events found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
