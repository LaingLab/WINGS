import { mockTrial } from '@renderer/store/mocks'

export const EventInfoArea = () => {
  return (
    <div className="flex-grow border-b border-white/20 p-3 pr-0">
      <p className="mb-1 font-semibold">Events</p>
      <div className="mr-1 flex max-h-31 flex-col gap-1 overflow-y-scroll pr-1 text-sm">
        {mockTrial.data?.events.map((event) => (
          <div
            key={event.type}
            className="flex w-full justify-between rounded-xl border border-white/10 bg-neutral-900/50 p-2"
          >
            <p>{event.name}</p>
            <p className="text-white/50">{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
