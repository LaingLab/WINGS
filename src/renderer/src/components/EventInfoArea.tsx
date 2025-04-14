import { eventInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'

export const EventInfoArea = () => {
  const eventInfo = useAtomValue(eventInfoAtom)

  return (
    <div className="flex-grow border-l border-white/20 p-3 pr-0">
      <p className="mb-1 font-semibold">Events</p>
      {(eventInfo ?? []).length > 0 ? (
        <div className="mr-0.5 flex max-h-31 flex-col gap-1 overflow-y-scroll pr-0.5 text-sm">
          {eventInfo?.map((event, i) => (
            <div
              key={`${event.type}+${i}`}
              className="flex w-full flex-col justify-between rounded-xl border border-white/10 bg-neutral-900/50 p-2"
            >
              <p>{event.name}</p>
              <p className="text-white/50">{event.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/40">Try running to trigger some events!</p>
      )}
    </div>
  )
}
