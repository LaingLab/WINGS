import { tempTrialInfoAtom, trialInfoAtom } from '@/store'
import { defaultTrialInfo } from '@shared/constants'
import { useAtom, useAtomValue } from 'jotai'
import { ChartSpline, Cog, RefreshCcwDot, Save } from 'lucide-react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

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

  const canSave = trialInfo !== tempTrialInfo

  const canReset = tempTrialInfo !== defaultTrialInfo

  return (
    <div className="flex justify-between gap-1">
      <div className="flex gap-1">
        <Link to="/debug">
          <button className="flex w-10 items-center justify-center text-white/80">
            <Cog />
          </button>
        </Link>
        <Link to="/results">
          <button className="flex w-10 items-center justify-center text-white/80">
            <ChartSpline />
          </button>
        </Link>
      </div>
      <div className="flex gap-1">
        <button
          type="submit"
          onClick={onSubmit}
          disabled={!canSave}
          className={twMerge(
            'flex w-10 items-center justify-center text-white/80 opacity-50',
            canSave && 'opacity-100'
          )}
        >
          <Save />
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!canReset}
          className={twMerge(
            'flex w-10 items-center justify-center text-white/80 opacity-50',
            canReset && 'opacity-100'
          )}
        >
          <RefreshCcwDot />
        </button>
      </div>
    </div>
  )
}

export const BottomTrialActions = () => {
  const trialInfo = useAtomValue(trialInfoAtom)

  const handleRun = () => {
    console.log('Running Trial...', trialInfo)
    window.context.runTrial(trialInfo)
  }

  const handleEnd = () => {
    console.log('Ending Trial...')
    window.context.endTrial()
  }

  return (
    <div className="trialInputs flex gap-1">
      <button onClick={handleRun}>Run</button>
      <button onClick={handleEnd}>End</button>
    </div>
  )
}
