import { trialInfoAtom } from '@/store'
import { useAtom } from 'jotai'
import { VideoSelector } from './VideoSelector'

export const TrialInputs = () => {
  const [trialInfo, setTrialInfo] = useAtom(trialInfoAtom)

  const onSubmit = () => {
    console.log('Saved Trial')
  }

  return (
    <div className="trialInputs flex-grow">
      <form action={onSubmit} className="flex flex-col gap-4">
        {/* Actions */}
        <div className="flex gap-1">
          <button type="submit">Save</button>
          <button type="button">Reset</button>
        </div>

        {/* Trial Info */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Trial Name"
            value={trialInfo.name}
            onChange={(e) =>
              setTrialInfo((prev) => {
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
            value={trialInfo.duration}
            onChange={(e) =>
              setTrialInfo((prev) => {
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
            value={trialInfo.arduinoInfo.path}
            onChange={(e) =>
              setTrialInfo((prev) => {
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
            <button type="button">Prime</button>
            <button type="button">Unprime</button>
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-1">
          <VideoSelector />
          <input
            type="text"
            placeholder="File name"
            value={trialInfo.videoInfo.fileName}
            onChange={(e) =>
              setTrialInfo((prev) => {
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
          <button type="button">Choose Output Folder</button>
        </div>
      </form>
    </div>
  )
}
