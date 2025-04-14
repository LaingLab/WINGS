import { trialLogsAtom } from '@renderer/store'
import { TrialLog } from '@shared/models'
import { useAtomValue } from 'jotai'

export const TrialLogArea = () => {
  const trialLogs = useAtomValue(trialLogsAtom)

  // Add autoscroll

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 border-t border-white/20 p-3">
      <p className="font-semibold">Logs</p>
      <div className="min-h-0 w-full flex-1 rounded-xl border border-white/20 bg-neutral-900 p-2 text-sm">
        <div className="h-full overflow-y-auto">
          {trialLogs?.map((log: TrialLog, index) => (
            <p key={index}>
              <span className="text-sm text-white/60">[{log.time}]</span> {log.data}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
