import { tempTrialInfoAtom, trialInfoAtom } from '@/store'
import { defaultTrialInfo } from '@shared/constants'
import { useAtom, useAtomValue } from 'jotai'
import { twMerge } from 'tailwind-merge'

export const BottomTrialActions = () => {
  const trialInfo = useAtomValue(trialInfoAtom)

  const handleRun = () => {
    console.log('Running Trial...', trialInfo)
    window.context.runTrial(trialInfo)
  }

  return (
    <div className="trialInputs flex gap-1">
      <button onClick={handleRun}>Run</button>
      <button>Files</button>
    </div>
  )
}

export const TopTrialActions = () => {
  const [trialInfo, setTrialInfo] = useAtom(trialInfoAtom)
  const [tempTrialInfo, setTempTrialInfo] = useAtom(tempTrialInfoAtom)

  const onSubmit = async () => {
    await setTrialInfo(tempTrialInfo)
    console.log(tempTrialInfo)

    if (tempTrialInfo === defaultTrialInfo) {
      window.context.deleteTrialInfo()
    } else {
      console.log('Saving trial info to file...')
      window.context.saveTrialInfo(tempTrialInfo)
    }
  }

  const onReset = () => {
    setTempTrialInfo(defaultTrialInfo)
  }

  const canSave = trialInfo != tempTrialInfo

  const canReset = tempTrialInfo != defaultTrialInfo

  return (
    <div className="flex gap-1">
      <button
        type="submit"
        onClick={onSubmit}
        disabled={!canSave}
        className={twMerge('opacity-50', canSave && 'opacity-100')}
      >
        Save
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={!canReset}
        className={twMerge('opacity-50', canReset && 'opacity-100')}
      >
        Reset
      </button>
    </div>
  )
}
