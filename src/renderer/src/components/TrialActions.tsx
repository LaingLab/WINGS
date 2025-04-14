import { trialInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'

export const TrialActions = () => {
  const trialInfo = useAtomValue(trialInfoAtom)

  const handleRun = () => {
    console.log('Running Trial...', trialInfo)
    window.context.runTrial(trialInfo)
  }
  return (
    <div className="trialInputs flex gap-1">
      <button onClick={handleRun}>Run</button>
      <button>Files</button>
      {/* <button>Results</button> */}
    </div>
  )
}
