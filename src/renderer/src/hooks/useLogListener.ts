import { trialLogsAtom } from '@/store'
import { TrialLog } from '@shared/models'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export function useLogListener() {
  const setTrialLogs = useSetAtom(trialLogsAtom)

  useEffect(() => {
    const unsub = window.context.onTrialLog((data: string) => {
      setTrialLogs((prev: TrialLog[]) => {
        const newLog = { data, time: new Date().toLocaleTimeString() }
        const newData = [...prev, newLog]

        return newData
      })
    })
    return () => unsub
  }, [setTrialLogs])
}
