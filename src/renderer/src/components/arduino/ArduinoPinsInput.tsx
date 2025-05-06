import { tempTrialInfoAtom } from '@renderer/store'
import { useImmerAtom } from 'jotai-immer'
import { Cog } from 'lucide-react'
import { Link } from 'react-router'
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
        <div className="btns flex gap-1">
          <Link to="/debug">
            <button className="flex w-10 items-center justify-center text-white/80">
              <Cog />
            </button>
          </Link>
          <button onClick={handleAddPin}>Add Pin</button>
        </div>

        <div className="mx-2 my-3 border-t border-neutral-700/50"></div>

        {tempTrialInfo.settings.arduino.pins.length > 0 ? (
          tempTrialInfo.settings.arduino.pins.map((pin, i) => (
            <ArduinoPin pin={pin} i={i} key={i} />
          ))
        ) : (
          <p className="text-center leading-4 text-neutral-700">No pins added...</p>
        )}
      </div>
    </div>
  )
}
