import { tempTrialInfoAtom, trialInfoAtom } from '@/store'
import { ArduinoPin } from '@shared/models'
import { useImmerAtom } from 'jotai-immer'
import { useEffect } from 'react'

export function useArduinoListener() {
  const [_, setTrialInfo] = useImmerAtom(trialInfoAtom)
  const [__, setTempTrialInfo] = useImmerAtom(tempTrialInfoAtom)

  useEffect(() => {
    const unsub = window.context.onArduinoPinUpdate((data: string) => {
      try {
        const parsed: ArduinoPin = JSON.parse(data)

        setTrialInfo((draft) => {
          const pins = draft.arduinoInfo.pins
          draft.arduinoInfo.pins[pins.findIndex((pin) => pin.pin == parsed.pin)] = parsed
        })
      } catch (err) {
        console.error('Invalid Arduino sensor JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialInfo])

  useEffect(() => {
    const unsub = window.context.onArduinoInfo((data: string) => {
      try {
        const parsed = JSON.parse(data)

        setTrialInfo((prev) => {
          const arduinoInfo = {
            ...prev.arduinoInfo,
            ...parsed
          }

          return { ...prev, arduinoInfo }
        })
      } catch (err) {
        console.error('Invalid Arduino Info JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialInfo])

  useEffect(() => {
    const unsub = window.context.onArduinoEvent((data: string) => {
      try {
        const event = JSON.parse(data)
        console.log('event recieved: ', event)

        setTrialInfo((prev) => {
          return {
            ...prev,
            data: {
              events: [event, ...(prev.data?.events || [])]
            }
          }
        })
      } catch (err) {
        console.error('Invalid Arduino Event JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialInfo])
}
