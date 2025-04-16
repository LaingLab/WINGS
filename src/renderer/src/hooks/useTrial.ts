import { tempTrialInfoAtom, trialInfoAtom } from '@renderer/store'
import { TrialInfo } from '@shared/models'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export function useTrial() {
  const setTrialInfo = useSetAtom(trialInfoAtom)
  const setTempTrialInfo = useSetAtom(tempTrialInfoAtom)

  useEffect(() => {
    async function fetchTrialInfo() {
      const trialInfoExists = await window.context.fileExists('trialInfo.json')

      if (trialInfoExists) {
        console.log('Found trial info! Loading...')
        const trialInfo = await window.context.readFile({ filename: 'trialInfo', filetype: 'json' })

        console.log(trialInfo)
        setTrialInfo(trialInfo as TrialInfo)
        setTempTrialInfo(trialInfo as TrialInfo)
      } else {
        console.log('No previous trial info found.')
      }
    }
    fetchTrialInfo()
  }, [setTrialInfo])

  useEffect(() => {
    const unsub = window.context.onTrialInfo((data: string) => {
      try {
        console.log('Recieved status update: ', data)
        const parsed = JSON.parse(data)

        setTrialInfo((prev) => {
          const newInfo = {
            ...prev,
            ...parsed
          }

          console.log('inf', newInfo)
          return newInfo
        })
      } catch (err) {
        console.error('Invalid Trial Info JSON:', data, err)
      }
    })

    return () => unsub
  }, [setTrialInfo])
}
