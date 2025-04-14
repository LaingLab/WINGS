import { mockTrial } from '@renderer/store/mocks'

export const ArduinoInfoArea = () => {
  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="font-semibold">Arduino Info</p>
      <div className="flex gap-2">
        {mockTrial.arduinoInfo.pins.map((pin) => (
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
  )
}
