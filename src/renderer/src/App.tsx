import { DebugPage, ResultsPage, TrialPage } from '@/components'
import { useArduinoListener, useLogListener, useTrial } from '@/hooks'
import { defaultTrialInfo } from '@shared/constants'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router'

export default function App() {
  const [trials, setTrials] = useState<string[]>([])

  useArduinoListener()
  useLogListener()
  useTrial()

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

  const handleCreateTrial = async () => {
    await window.context.updateFileDir(defaultTrialInfo.name)
    await window.context.saveTrialInfo(defaultTrialInfo)

    await window.context
      .listTrials()
      .then((trialList: string[]) => setTrials(trialList))
      .catch((err: Error) => console.error(err))
  }

  return (
    <ReactRouter>
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        <div className="flex gap-2 text-4xl font-bold tracking-tight">
          <p>Home</p>
          <button
            className="rounded-full border border-white/15 bg-neutral-900 p-2 duration-150 hover:bg-neutral-800"
            onClick={handleCreateTrial}
          >
            <Plus />
          </button>
        </div>
        {trials.length > 0 ? (
          trials.map((trial) => {
            return (
              <div key={trial} className="flex flex-col items-center justify-center gap-2">
                <a href={`/trial/${trial}`} className="text-blue-500 hover:underline">
                  {trial}
                </a>
              </div>
            )
          })
        ) : (
          <p>No trials found</p>
        )}
      </div>
    </ReactRouter>
  )
}

function ReactRouter({ children }: { children: React.ReactNode }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={children} />
        <Route path="/trial/:trialId" element={<TrialPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  )
}
