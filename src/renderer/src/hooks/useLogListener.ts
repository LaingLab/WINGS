import { trialDataAtom } from '@renderer/store'
import { useImmerAtom } from 'jotai-immer'
import { useEffect } from 'react'

export function useLogListener() {
  const [_, setTrialLogs] = useImmerAtom(trialDataAtom)

  useEffect(() => {
    const unsub = window.context.onTrialLog((data: string) => {
      setTrialLogs((draft) => {
        const parsed = JSON.parse(data)
        console.log('Log received: ', parsed)
        draft.logs = [...(draft.logs || []), parsed]
      })
    })
    return () => unsub
  }, [setTrialLogs])
}
