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
}
