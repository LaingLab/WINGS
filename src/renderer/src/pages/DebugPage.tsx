import { TrialLogArea } from '@/components'
import { trialDataAtom, trialInfoAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'

export const DebugPage = () => {
  const trialInfo = useAtomValue(trialInfoAtom)
  const trialData = useAtomValue(trialDataAtom)
  const { id } = useParams()

  const toggleLed = (pin: number, state: string) => {
    window.context.toggleLed({
      pin,
      state
    })
  }

  const togglePump = (pins: [number, number, number], state: string, speed?: number) => {
    window.context.togglePump({
      pins,
      state,
      speed
    })
  }

  return (
    <div className="flex h-full gap-1 p-3">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to={`/trial/${id}`}
            className="rounded-full bg-white p-1 text-black duration-150 hover:bg-white/50"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-3xl font-medium">Pin Debug Panel</h1>
        </div>

        {/* Connect Btn */}
        <div className="flex items-center gap-2">
          <button className="btn w-40" onClick={() => window.context.arduinoConnect()}>
            Connect
          </button>
          <p>Status: {trialData.arduinoData.status}</p>
        </div>

        {/* Pins */}
        <div className="space-y-1">
          {trialInfo.settings.arduino.pins.map((pin, i) => (
            <div key={i} className="flex w-100 items-center justify-between gap-1">
              <div className="flex gap-1">
                {pin.label} - {pin.type} - {pin.pin}
              </div>
              {pin.type !== 'pump' ? (
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
                    className="btn w-12"
                    onClick={() =>
                      togglePump(
                        (pin.pins as [number, number, number]) ??
                          ([-1, -1, -1] as [number, number, number]),
                        'reverse',
                        25
                      )
                    }
                  >
                    rev
                  </button>
                  <button
                    className="btn w-10"
                    onClick={() =>
                      togglePump(
                        (pin.pins as [number, number, number]) ??
                          ([-1, -1, -1] as [number, number, number]),
                        'on',
                        25
                      )
                    }
                  >
                    on
                  </button>
                  <button
                    className="btn w-10"
                    onClick={() =>
                      togglePump(
                        (pin.pins as [number, number, number]) ??
                          ([-1, -1, -1] as [number, number, number]),
                        'off'
                      )
                    }
                  >
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
