import { defaultTrialInfo } from '@shared/constants'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

type TrialList = {
  id: string
  name: string
}

export function HomePage() {
  const [trials, setTrials] = useState<TrialList[]>([])

  useEffect(() => {
    async function fetchTrials() {
      await window.context.updateFileDir()
      await window.context
        .listTrials()
        .then((trialList: TrialList[]) => setTrials(trialList))
        .catch((err: Error) => console.error(err))
    }
    fetchTrials()
  }, [])

  const handleCreateTrial = async () => {
    await window.context.saveTrialInfo({
      ...defaultTrialInfo,
      id: Math.random().toString(36).substring(2, 15),
      dateCreated: new Date().toISOString(),
      lastOpened: new Date().toISOString()
    })

    await window.context
      .listTrials()
      .then((trialList: TrialList[]) => setTrials(trialList))
      .catch((err: Error) => console.error(err))
  }

  return (
    <div className="flex h-screen items-center justify-center gap-20 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-8xl font-light tracking-tight">WINGS</p>
        <p className="text-white/50">A testing software for LaingLab's GLIDE</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-3xl">Trials</p>
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
              <Link
                key={trial.id}
                to={`/trial/${trial.id}`}
                className="flex w-80 flex-col items-center justify-center gap-2 rounded-md border border-white/20 bg-neutral-900 py-5"
              >
                {trial.name != '' ? (
                  <p>
                    {trial.name} <span className="text-white/50"> - {trial.id}</span>
                  </p>
                ) : (
                  'Unnamed Trial'
                )}
              </Link>
            )
          })
        ) : (
          <p>No trials found</p>
        )}
      </div>
    </div>
  )
}
