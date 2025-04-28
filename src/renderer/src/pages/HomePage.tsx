import { defaultTrialInfo } from '@shared/constants'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

type TrialList = {
  id: string
  name: string
}

export function HomePage() {
  const [trials, setTrials] = useState<TrialList[]>([])

  useEffect(() => {
    async function fetchTrials() {
      await window.context
        .listTrials()
        .then((trialList: TrialList[]) => setTrials(trialList))
        .catch((err: Error) => console.error(err))
    }
    fetchTrials()
  }, [])

  const handleCreateTrial = async () => {
    await window.context.saveTrialInfo({ ...defaultTrialInfo, id: new Date().getTime().toString() })

    await window.context
      .listTrials()
      .then((trialList: TrialList[]) => setTrials(trialList))
      .catch((err: Error) => console.error(err))
  }

  return (
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
            <div key={trial.id} className="flex flex-col items-center justify-center gap-2">
              <a href={`/trial/${trial.id}`} className="text-blue-500 hover:underline">
                {trial.name}
              </a>
            </div>
          )
        })
      ) : (
        <p>No trials found</p>
      )}
    </div>
  )
}
