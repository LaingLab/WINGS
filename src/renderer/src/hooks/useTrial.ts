import { tempTrialInfoAtom, trialInfoAtom } from '@renderer/store'
import { TrialInfo } from '@shared/models'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export function useTrial() {
  const setTrialInfo = useSetAtom(trialInfoAtom)
  const setTempTrialInfo = useSetAtom(tempTrialInfoAtom)

  const { id } = useParams()

  useEffect(() => {
    async function fetchTrialInfo() {
      const trialInfoExists = await window.context.fileExists(`${id}/trialInfo.json`)

      if (trialInfoExists) {
        console.log('Found trial info! Loading...')
        const trialInfo = await window.context.readFile({
          filename: `${id}/trialInfo.json`,
          filetype: 'json'
        })

        console.log(trialInfo)
        setTrialInfo({ ...trialInfo, id } as TrialInfo)
        setTempTrialInfo({ ...trialInfo, id } as TrialInfo)
      } else {
        console.log('No previous trial info found.')
      }
    }
    fetchTrialInfo()
  }, [setTrialInfo, setTempTrialInfo])

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
