import { TrialInfo } from '@shared/models'
import { ArrowLeft, CameraOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

const ResultsPage = () => {
  const [trials, setTrials] = useState<string[]>([])
  const [selectedTrial, setSelectedTrial] = useState<string>('')
  const [logs, setLogs] = useState<string>('')
  const [sensorReadings, setSensorReadings] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [videoPath, setVideoPath] = useState<string>('')

  useEffect(() => {
    async function fetchTrials() {
      window.context.updateFileDir()

      await window.context
        .listTrials()
        .then((trialList: string[]) => setTrials(trialList))
        .catch((err: Error) => console.error(err))
    }
    fetchTrials()
    return () => window.context.updateFileDir()
  }, [])

  useEffect(() => {
    if (!selectedTrial) return

    async function fetchInfo() {
      const dir = await window.context.updateFileDir(selectedTrial)

      setVideoPath(`${dir}/video.webm`)
      console.log(dir)

      const logsText = await window.context.readFile({ filename: 'logs', filetype: 'txt' })
      if (logsText) setLogs(logsText as any)

      const sensorData = await window.context.readFile({
        filename: 'sensor_readings',
        filetype: 'jsonl'
      })
      if (sensorData) {
        console.log('Sensor Data', sensorData)
        setSensorReadings(sensorData as any[])
      }

      const eventsData = await window.context.readFile({ filename: 'events', filetype: 'jsonl' })
      if (eventsData) {
        console.log('Event Data', eventsData)
        setEvents(eventsData as any[])
      }

      const trialInfo = (await window.context.readFile({
        filename: 'trialInfo',
        filetype: 'json'
      })) as TrialInfo
      if (trialInfo && trialInfo.videoInfo?.fileName) {
        const vPath = trialInfo.videoInfo.fileName
        setVideoPath(vPath)
      }
    }
    fetchInfo()
  }, [selectedTrial])

  return (
    <div className="flex h-screen flex-col p-4">
      <div className="flex w-full items-center justify-between">
        <div className="mb-2 flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-white p-1 text-black duration-150 hover:bg-white/50"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-3xl font-medium">Trial Results</h1>
        </div>

        <select
          id="trials-select"
          className="mb-4 rounded border bg-neutral-800 p-2"
          onChange={(e) => setSelectedTrial(e.target.value)}
          value={selectedTrial}
        >
          <option value="">-- Select a trial --</option>
          {trials.map((trial) => (
            <option key={trial} value={trial}>
              {trial}
            </option>
          ))}
        </select>
      </div>

      {selectedTrial && (
        <div className="flex h-full min-h-0 gap-4">
          <div className="flex w-1/2 flex-col gap-6">
            <div className="mb-4 aspect-video">
              <h2 className="text-xl font-semibold">Video</h2>

              {selectedTrial ? (
                <>
                  {videoPath ? (
                    <video
                      src={`file://${videoPath}`}
                      controls
                      className="h-full w-full rounded-xl object-cover"
                      playsInline
                      muted
                    />
                  ) : (
                    <p>No video available.</p>
                  )}
                </>
              ) : (
                <CameraOff size={80} className="text-neutral-800" />
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-1">
              <p className="text-xl font-semibold">Logs</p>
              <div className="min-h-0 min-w-0 flex-1 rounded-xl border border-white/20 bg-neutral-900 p-2 text-sm">
                <div className="h-full overflow-x-auto overflow-y-auto">
                  <pre className="break-words whitespace-pre-wrap">{logs}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-1/2 flex-col gap-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Sensor Readings</h2>
              {sensorReadings?.map((reading, index) => (
                <div key={index} className="border-b py-1">
                  {JSON.stringify(reading)}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold">Events</h2>
              {events?.map((ev, index) => (
                <div key={index} className="border-b py-1">
                  <strong>{ev.time}</strong> - {ev.name} ({ev.type})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPage
