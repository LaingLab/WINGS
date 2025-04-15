import { tempTrialInfoAtom } from '@/store'
import { useAtom } from 'jotai'
import { TopTrialActions } from './TrialActions'
import { VideoSelector } from './VideoSelector'

export const TrialInputs = () => {
  const [tempTrialInfo, setTempTrialInfo] = useAtom(tempTrialInfoAtom)

  return (
    <div className="trialInputs flex-grow">
      <div className="flex flex-col gap-4">
        {/* Actions */}
        <TopTrialActions />

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
          {/* <input
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
          /> */}
        </div>

        {/* Video Info */}
        <div className="space-y-1">
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
          <VideoSelector />
          {/* <button type="button">Choose Output Folder</button> */}
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
      </div>
    </div>
  )
}
