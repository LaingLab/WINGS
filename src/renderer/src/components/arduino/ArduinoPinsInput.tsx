import { tempTrialInfoAtom } from '@renderer/store'
import { useImmerAtom } from 'jotai-immer'
import { ArduinoPin } from './ArduinoPin'

export const ArduinoPinsInput = () => {
  const [tempTrialInfo, setTempTrialInfo] = useImmerAtom(tempTrialInfoAtom)

  const handleAddPin = () => {
    setTempTrialInfo((draft) => {
      draft.settings.arduino.pins.push({ pin: '13', type: 'led', value: 'off' })
    })
  }

  return (
    <div>
      <div className="space-y-1">
        <button className="btn" onClick={handleAddPin}>
          Add Pin
        </button>
        {tempTrialInfo.settings.arduino.pins.map((pin, i) => (
          <ArduinoPin pin={pin} i={i} key={i} />
        ))}
      </div>
    </div>
  )
}
