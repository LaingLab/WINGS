import { tempTrialInfoAtom } from '@/store'
import { useImmerAtom } from 'jotai-immer'
import { ArduinoPinsInput } from '../arduino/ArduinoPinsInput'
import { VideoSelector } from '../video/VideoSelector'
import { TopTrialActions } from './TrialActions'

export const TrialInputs = () => {
  const [tempTrialInfo, setTempTrialInfo] = useImmerAtom(tempTrialInfoAtom)

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
            value={tempTrialInfo.name ?? ''}
            onChange={(e) =>
              setTempTrialInfo((draft) => {
                draft.name = e.target.value
              })
            }
          />
        </div>

        {/* Video Info */}
        <div className="space-y-1">
          <VideoSelector />
          {/* <button type="button">Choose Output Folder</button> */}
        </div>

        {/* Arduino Info */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Arduino Path"
            value={tempTrialInfo.settings.arduino.path}
            onChange={(e) =>
              setTempTrialInfo((draft) => {
                draft.settings.arduino.path = e.target.value
              })
            }
          />

          {/* Btns */}
          <div className="flex gap-1">
            {/* <button type="button" onClick={() => window.context.arduinoConnect()}>
              Connect
            </button> */}
          </div>
        </div>

        {/* Arduino Pins */}
        <ArduinoPinsInput />
      </div>
    </div>
  )
}
