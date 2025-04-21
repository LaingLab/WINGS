import { trialInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'

export const TrialInfoArea = () => {
  const trialInfo = useAtomValue(trialInfoAtom)
  return (
    <div className="flex justify-between p-3">
      <p>{trialInfo.name || 'Unnamed Trial'}</p>
      <div className="flex gap-4">
        <p>
          <span className="text-white/40">Duration:</span> {trialInfo.duration || 'n/a'}
        </p>
        <p>
          <span className="text-white/40">Status:</span> {trialInfo.status}
        </p>
      </div>
    </div>
  )
}
