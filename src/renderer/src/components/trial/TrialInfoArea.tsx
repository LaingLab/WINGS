import { trialDataAtom, trialInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'

export const TrialInfoArea = () => {
  const trialInfo = useAtomValue(trialInfoAtom)
  const trialData = useAtomValue(trialDataAtom)

  return (
    <div className="flex justify-between p-3">
      <p>{trialInfo.name || 'Unnamed Trial'}</p>
      <div className="flex gap-4">
        <p>
          <span className="text-white/40">Duration:</span> {trialData.duration || 'n/a'}
        </p>
        <p>
          <span className="text-white/40">Status:</span> {trialData.status}
        </p>
      </div>
    </div>
  )
}
