import { mockTrial } from '@/store/mocks'

export const TrialInputs = () => {
  const onSubmit = () => {
    console.log('Saved Trial')
  }

  return (
    <div className="trialInputs flex-grow">
      <form action={onSubmit} className="flex flex-col gap-4">
        <div className="flex gap-1">
          <button value="submit">Save</button>
          <button>Reset</button>
        </div>
        <div className="space-y-1">
          <input type="text" placeholder="Trial Name" value={mockTrial.name} />
          <input type="number" placeholder="Duration  ( 0: inf )" value={mockTrial.duration} />
          <button>Choose Output Folder</button>
        </div>

        <div className="space-y-1">
          <input type="text" placeholder="Arduino Path" value={mockTrial.arduinoInfo.path} />
          <div className="flex gap-1">
            <button>Prime</button>
            <button>Unprime</button>
          </div>
        </div>

        <div className="space-y-1">
          <input type="text" placeholder="Video Path" value={mockTrial.videoInfo.path} />
          <input type="text" placeholder="File name" value={mockTrial.videoInfo.fileName} />
        </div>
      </form>
    </div>
  )
}
