import { trialInfoAtom } from '@renderer/store'
import { useImmerAtom } from 'jotai-immer'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { TrialLogArea } from './trial/TrialLogArea'

export const DebugPage = () => {
  const [trialInfo, setTrialInfo] = useImmerAtom(trialInfoAtom)

  const toggleLed = (pin: number, state: string) => {
    window.context.toggleLed({
      pin,
      state
    })
  }

  const togglePump = (pin: number, state: string, speed?: number) => {
    window.context.togglePump({
      pins: [pin, pin + 1, pin + 2],
      state,
      speed
    })
  }

  return (
    <div className="flex h-full gap-1 p-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-white p-1 text-black duration-150 hover:bg-white/50"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-3xl font-medium">Pin Debug Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn w-40" onClick={() => window.context.arduinoConnect()}>
            Connect
          </button>
          <p>Status: {trialInfo.arduinoInfo.status}</p>
        </div>
        <div className="space-y-1">
          {trialInfo.arduinoInfo.pins.map((pin, i) => (
            <div key={i} className="flex w-100 justify-between gap-1">
              <div className="flex gap-1">
                <p className="input w-24 bg-neutral-800">{pin.type}</p>
                <p className="input">{pin.pin}</p>
                <p className="input">{pin.value}</p>
              </div>
              {pin.type === 'led' ? (
                <div className="flex gap-1">
                  <button className="btn w-10" onClick={() => toggleLed(Number(pin.pin), 'on')}>
                    on
                  </button>
                  <button className="btn w-10" onClick={() => toggleLed(Number(pin.pin), 'off')}>
                    off
                  </button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <button
                    className="btn w-20"
                    onClick={() => togglePump(Number(pin.pin), 'reverse', 25)}
                  >
                    reverse
                  </button>
                  <button
                    className="btn w-10"
                    onClick={() => togglePump(Number(pin.pin), 'on', 25)}
                  >
                    on
                  </button>
                  <button className="btn w-10" onClick={() => togglePump(Number(pin.pin), 'off')}>
                    off
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <TrialLogArea />
    </div>
  )
}
