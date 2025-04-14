import { tempTrialInfoAtom, trialInfoAtom } from '@/store'
import { defaultTrialInfo } from '@shared/constants'
import { useAtom } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { VideoSelector } from './VideoSelector'

export const TrialInputs = () => {
  const [trialInfo, setTrialInfo] = useAtom(trialInfoAtom)
  const [tempTrialInfo, setTempTrialInfo] = useAtom(tempTrialInfoAtom)

  const onSubmit = () => {
    setTrialInfo(tempTrialInfo)
  }

  const onReset = () => {
    setTempTrialInfo(defaultTrialInfo)
  }

  const canSave = trialInfo != tempTrialInfo

  const canReset = tempTrialInfo != defaultTrialInfo

  return (
    <div className="trialInputs flex-grow">
      <form action={onSubmit} className="flex flex-col gap-4">
        {/* Actions */}
        <div className="flex gap-1">
          <button
            type="submit"
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

        {/* Trial Info */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Trial Name"
            value={tempTrialInfo.name}
            onChange={(e) =>
              setTempTrialInfo((prev) => {
                return {
                  ...prev,
                  name: e.target.value
                }
              })
            }
          />
          <input
            type="number"
            placeholder="Duration  ( 0: inf )"
            value={tempTrialInfo.duration}
            onChange={(e) =>
              setTempTrialInfo((prev) => {
                return {
                  ...prev,
                  duration: e.target.value
                }
              })
            }
          />
        </div>

        {/* Arduino Info */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Arduino Path"
            value={tempTrialInfo.arduinoInfo.path}
            onChange={(e) =>
              setTempTrialInfo((prev) => {
                return {
                  ...prev,
                  arduinoInfo: {
                    ...prev.arduinoInfo,
                    path: e.target.value
                  }
                }
              })
            }
          />
          <div className="flex gap-1">
            <button type="button" onClick={() => window.context.arduinoConnect()}>
              Connect
            </button>
            <button type="button" onClick={() => window.context.primeArduino()}>
              Prime
            </button>
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-1">
          <VideoSelector />
          <input
            type="text"
            placeholder="File name"
            value={tempTrialInfo.videoInfo.fileName}
            onChange={(e) =>
              setTempTrialInfo((prev) => {
                return {
                  ...prev,
                  videoInfo: {
                    ...prev.videoInfo,
                    fileName: e.target.value
                  }
                }
              })
            }
          />
          {/* <button type="button">Choose Output Folder</button> */}
        </div>
      </form>
    </div>
  )
}
