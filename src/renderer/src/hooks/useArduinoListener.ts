import { trialDataAtom } from '@/store'
import { Pin } from '@shared/models'
import { useImmerAtom } from 'jotai-immer'
import { useEffect } from 'react'

export function useArduinoListener() {
  const [_, setTrialData] = useImmerAtom(trialDataAtom)

  useEffect(() => {
    const unsub = window.context.onArduinoPinUpdate((data: string) => {
      try {
        const parsed: Pin = JSON.parse(data)
        console.log('Pin update recieved: ', parsed)

        setTrialData((draft) => {
          const pins = draft.arduinoData.pins
          draft.arduinoData.pins[pins.findIndex((pin) => pin.pin == parsed.pin)] = parsed
        })
      } catch (err) {
        console.error('Invalid Arduino sensor JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialData])

  useEffect(() => {
    const unsub = window.context.onArduinoInfo((data: string) => {
      try {
        const parsed = JSON.parse(data)
        console.log('Info recieved: ', parsed)

        setTrialData((prev) => {
          const arduinoData = {
            ...prev.arduinoData,
            ...parsed
          }

          return { ...prev, arduinoData }
        })
      } catch (err) {
        console.error('Invalid Arduino Info JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialData])

  useEffect(() => {
    const unsub = window.context.onArduinoEvent((data: string) => {
      try {
        const event = JSON.parse(data)
        console.log('Event recieved: ', event)

        setTrialData((prev) => {
          return {
            ...prev,
            events: [event, ...(prev.events || [])]
          }
        })
      } catch (err) {
        console.error('Invalid Arduino Event JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialData])
}
