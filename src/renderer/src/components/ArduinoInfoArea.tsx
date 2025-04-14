import { trialInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'

export const ArduinoInfoArea = () => {
  const trialInfo = useAtomValue(trialInfoAtom)

  return (
    <div className="flex h-28 gap-2 p-3">
      <div className="w-1/3">
        <p className="mb-2 font-semibold">Arduino</p>
        <p>
          <span className="mb-1 text-white/30">Path:</span> {trialInfo.arduinoInfo.path || 'n/a'}
        </p>
        <p>
          <span className="text-white/30">Status:</span> {trialInfo.arduinoInfo.status}
        </p>
      </div>
      <div className="w-2/3">
        <p>Pins</p>
        <div className="flex gap-2">
          {trialInfo.arduinoInfo.pins.map((pin) => (
            <div
              key={pin.pin}
              className="rounded-xl border border-white/10 bg-neutral-900/50 p-2 text-center"
            >
              <p className="text-xl text-white/60">{pin.start}</p>
              <div className="mt-1 flex gap-1 text-sm">
                <p>{pin.type}</p>
                <p>{pin.pin}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
