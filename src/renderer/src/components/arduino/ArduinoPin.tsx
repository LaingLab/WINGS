import { tempTrialInfoAtom } from '@renderer/store'
import { Pin } from '@shared/models'
import { useImmerAtom } from 'jotai-immer'
import { ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '../modals/Modal'

export const ArduinoPin = ({ pin, i }: { pin: any; i: number }) => {
  const [tempTrialInfo, setTempTrialInfo] = useImmerAtom(tempTrialInfoAtom)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex gap-1">
      {/* <button
        className="flex items-center justify-center"
        onClick={() =>
          setTempTrialInfo((draft) => {
            draft.settings.arduino.pins.splice(i, 1)
          })
        }
      >
        <X />
      </button>

      <input
        type="text"
        placeholder="pin"
        value={pin.pin}
        onChange={(e) =>
          setTempTrialInfo((draft) => {
            draft.settings.arduino.pins[i].pin = e.target.value
          })
        }
      />
      <button onClick={() => setModalOpen(true)} className="flex items-center justify-center">
        <Cog />
      </button> */}

      <div className="flex h-10 w-full items-center justify-between gap-1 rounded-md border border-white/20 bg-neutral-800">
        <div className="flex gap-2">
          <button
            className="ml-1 flex items-center justify-center text-neutral-600 duration-150 hover:text-red-500"
            onClick={() =>
              setTempTrialInfo((draft) => {
                draft.settings.arduino.pins.splice(i, 1)
              })
            }
          >
            <X />
          </button>

          <p>
            {pin.pin} - {pin.label ?? 'unnamed'}
          </p>
        </div>

        <button
          className="hover: flex h-full w-16 items-center justify-end rounded-r-md bg-gradient-to-r from-transparent to-black/50 opacity-0 duration-150 hover:opacity-75"
          onClick={() => setModalOpen(true)}
        >
          <ChevronRight />
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold">Pin Settings</p>

          <div className="flex gap-1">
            <input
              className="input w-full"
              type="text"
              placeholder="Label"
              value={pin.label}
              onChange={(e) => {
                setTempTrialInfo((draft) => {
                  draft.settings.arduino.pins[i].label = e.target.value
                })
              }}
            />

            <input
              className="input w-full"
              type="text"
              placeholder="Pin"
              value={pin.pin}
              onChange={(e) => {
                setTempTrialInfo((draft) => {
                  draft.settings.arduino.pins[i].pin = e.target.value
                })
              }}
            />

            <select
              className="btn w-24 bg-neutral-800 px-1"
              value={pin.type}
              onChange={(e) =>
                setTempTrialInfo((draft) => {
                  draft.settings.arduino.pins[i].type = e.target.value as Pin['type']
                })
              }
            >
              <option value="pin">pin</option>
              <option value="led">led</option>
              <option value="switch">switch</option>
              <option value="sensor">sensor</option>
              <option value="pump">pump</option>
            </select>
          </div>

          <div className="flex gap-1">
            <p className="ml-0.5">Display Logs?</p>
            <input
              type="checkbox"
              checked={pin.log}
              className="checkbox"
              onChange={(e) => {
                setTempTrialInfo((draft) => {
                  draft.settings.arduino.pins[i].log = e.target.checked
                })
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
