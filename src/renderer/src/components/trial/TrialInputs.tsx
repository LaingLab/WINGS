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
        <div className="space-y-0.5">
          <p className="pl-0.5 text-sm text-white/50">Trial Name</p>
          <input
            type="text"
            placeholder="Type Something..."
            value={tempTrialInfo.name ?? ''}
            onChange={(e) =>
              setTempTrialInfo((draft) => {
                draft.name = e.target.value
              })
            }
          />
        </div>

        {/* Video Info */}
        <div className="space-y-0.5">
          <p className="pl-0.5 text-sm text-white/50">Video Input Device</p>
          <VideoSelector />
          {/* <button type="button">Choose Output Folder</button> */}
        </div>

        {/* Arudino Input */}

        {/* Arduino Pins */}
        <div className="space-y-0.5">
          <p className="pl-0.5 text-sm text-white/50">Arduino Options</p>
          <ArduinoPinsInput />
        </div>
      </div>
    </div>
  )
}
