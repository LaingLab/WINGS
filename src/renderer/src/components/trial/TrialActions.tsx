import { tempTrialInfoAtom, trialDataAtom, trialInfoAtom } from '@/store'
import { defaultTrialInfo } from '@shared/constants'
import { useAtom, useAtomValue } from 'jotai'
import { ChartSpline, Home, RefreshCcwDot, Save } from 'lucide-react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

export const TopTrialActions = () => {
  const [trialInfo, setTrialInfo] = useAtom(trialInfoAtom)
  const [tempTrialInfo, setTempTrialInfo] = useAtom(tempTrialInfoAtom)

  const onSubmit = async () => {
    setTrialInfo(tempTrialInfo)
    console.log('Saving trial info to file...', tempTrialInfo)
    window.context.saveTrialInfo(tempTrialInfo)
  }

  const onReset = () => {
    setTempTrialInfo({
      ...defaultTrialInfo,
      id: trialInfo.id
    })
  }

  const canSave = trialInfo !== tempTrialInfo

  const canReset = tempTrialInfo !== defaultTrialInfo

  return (
    <div className="btns flex justify-between gap-1">
      <div className="flex gap-1">
        <Link to="/">
          <button className="flex w-10 items-center justify-center text-white/80">
            <Home />
          </button>
        </Link>
        <Link to={`/results/${trialInfo.id}`}>
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
  const trialData = useAtomValue(trialDataAtom)

  const handleRun = () => {
    console.log('Running Trial...', trialInfo)
    window.context.runTrial(trialInfo)
  }

  const handleEnd = () => {
    console.log('Ending Trial...')
    window.context.endTrial({
      id: trialInfo.id,
      endTime: new Date().toISOString(),
      trialInfo: trialInfo,
      trialData: trialData
    })
  }

  return (
    <div className="trialInputs btns flex gap-1">
      <button onClick={handleRun}>Run</button>
      <button onClick={handleEnd}>End</button>
    </div>
  )
}
