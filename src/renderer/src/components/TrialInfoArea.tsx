import { mockTrial } from '@/store/mocks'

export const TrialInfoArea = () => {
  return (
    <div className="flex justify-between p-3">
      <p>{mockTrial.name}</p>
      <p>
        <span className="text-white/40">Status:</span> {mockTrial.status}
      </p>
    </div>
  )
}
