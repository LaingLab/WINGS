import { trialDataAtom } from '@renderer/store'
import { Log } from '@shared/models'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'

export const TrialLogArea = () => {
  const { logs } = useAtomValue(trialDataAtom)
  const containerRef = useRef<HTMLDivElement>(null)

  // autoscroll to bottom on new logs
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [logs])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 border-t border-white/20 p-3">
      <p className="font-semibold">Logs</p>
      <div className="min-h-0 min-w-0 flex-1 rounded-xl border border-white/20 bg-neutral-900 p-2 text-sm">
        <div ref={containerRef} className="h-full overflow-y-auto">
          {logs?.map((log: Log, index) => (
            <p key={index}>
              <span className="text-sm text-white/60">[{log.time}]</span>{' '}
              <span className="text-sm text-blue-500/60">[{log.type}]</span>{' '}
              <span className="break-all">{log.data}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
