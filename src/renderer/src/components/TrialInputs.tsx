import { tempTrialInfoAtom } from '@/store'
import { useImmerAtom } from 'jotai-immer'
import { TopTrialActions } from './TrialActions'
import { VideoSelector } from './VideoSelector'

export const TrialInputs = () => {
  const [tempTrialInfo, setTempTrialInfo] = useImmerAtom(tempTrialInfoAtom)

  const handleAddPin = () => {
    setTempTrialInfo((draft) => {
      draft.arduinoInfo.pins.push({ id: 'led-13', pin: '13', type: 'led', value: 'off' })
    })
  }

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
          <input
            type="text"
            placeholder="Video Filename"
            value={tempTrialInfo.videoInfo.fileName}
            onChange={(e) =>
              setTempTrialInfo((draft) => {
                draft.videoInfo.fileName = e.target.value
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
              setTempTrialInfo((draft) => {
                draft.arduinoInfo.path = e.target.value
              })
            }
          />

          {/* Btns */}
          <div className="flex gap-1">
            {/* <button type="button" onClick={() => window.context.arduinoConnect()}>
              Connect
            </button> */}
            <button type="button" onClick={() => window.context.primeArduino()}>
              Prime
            </button>
          </div>
        </div>

        {/* Arduino Pins */}
        <div className="space-y-1">
          <button onClick={handleAddPin}>Add Pin</button>
          {tempTrialInfo.arduinoInfo.pins.map((pin, i) => (
            <div key={i} className="flex gap-1">
              <input
                className="w-24"
                type="text"
                placeholder="type"
                value={pin.type}
                onChange={(e) =>
                  setTempTrialInfo((draft) => {
                    draft.arduinoInfo.pins[i].type = e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="pin"
                value={pin.pin}
                onChange={(e) =>
                  setTempTrialInfo((draft) => {
                    draft.arduinoInfo.pins[i].pin = e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="value"
                value={pin.value}
                onChange={(e) =>
                  setTempTrialInfo((draft) => {
                    draft.arduinoInfo.pins[i].value = e.target.value
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
