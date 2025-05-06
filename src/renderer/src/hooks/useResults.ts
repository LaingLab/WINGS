import { trialResultsAtom } from '@renderer/store'
import { TrialResults } from '@shared/models'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export function useResults() {
  const setTrialResultsAtom = useSetAtom(trialResultsAtom)

  const { id } = useParams()

  useEffect(() => {
    async function fetchTrialResults() {
      const trialResultsExists = await window.context.fileExists(`${id}/trialResults.json`)

      if (trialResultsExists) {
        console.log('Found trial results! Loading...')
        const trialResults = await window.context.readFile({
          filename: `${id}/trialResults`,
          filetype: 'json'
        })

        console.log(trialResults)
        setTrialResultsAtom({ ...trialResults, id } as TrialResults)
      } else {
        console.log('No previous trial results found.')
      }
    }
    fetchTrialResults()
  }, [id, setTrialResultsAtom])
}
