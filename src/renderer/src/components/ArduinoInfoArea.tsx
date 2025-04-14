import { arduinoInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { twMerge } from 'tailwind-merge'

export const ArduinoInfoArea = () => {
  const arduinoInfo = useAtomValue(arduinoInfoAtom)

  return (
    <div className="flex justify-between gap-4 p-3">
      {/* Info */}
      <div className="text-nowrap">
        <p className="font-semibold">Arduino</p>

        <p className="text-sm">
          <span className="text-white/30">Status:</span> {arduinoInfo.status}
        </p>
        <p className="text-sm">
          <span className="text-white/30">Primed:</span>{' '}
          {arduinoInfo.primed ? 'primed' : 'unprimed'}
        </p>
        <p className="text-sm">
          <span className="mb-1 text-white/30">Path:</span> {arduinoInfo.path || 'n/a'}
        </p>
      </div>

      {/* Pins */}
      <div className="w-fit">
        <p className="font-semibold">Pins</p>
        <div className="flex flex-wrap gap-1">
          {arduinoInfo.pins.map((pin) => (
            <div
              key={pin.pin}
              className="rounded-xl border border-white/10 bg-neutral-900/50 p-2 text-center"
            >
              <p className={twMerge('text-xl text-white/30', pin.value != 'off' && 'text-white')}>
                {pin.value}
              </p>
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
