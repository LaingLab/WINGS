import { trialInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { VideoPreview } from './VideoPreview'

export const VideoInfoArea = () => {
  const trialInfo = useAtomValue(trialInfoAtom)

  return (
    <div className="flex justify-between gap-2 border-t border-b border-white/20 p-3">
      <div className="flex w-1/4 flex-col gap-2.5 text-sm leading-5">
        <p className="text-base font-semibold">Video Info</p>
        <div>
          <p className="text-white/30">Label</p>
          <p className="line-clamp-2 break-words">{trialInfo.settings.video.label || 'n/a'}</p>
        </div>
        <div>
          <p className="text-white/30">Device ID</p>
          <p className="line-clamp-1 break-all">{trialInfo.settings.video.path || 'n/a'}</p>
        </div>
      </div>
      <div className="flex aspect-video h-fit w-3/4 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/50">
        <VideoPreview />
      </div>
    </div>
  )
}
