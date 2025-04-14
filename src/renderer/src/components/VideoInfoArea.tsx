import { mockTrial } from '@/store/mocks'

export const VideoInfoArea = () => {
  return (
    <div className="flex justify-between gap-2 border-t border-b border-white/20 p-3">
      <div className="flex flex-col gap-2.5 text-sm leading-5">
        <p className="text-base font-semibold">Recording Info</p>
        <div>
          <p className="text-white/30">Path</p>
          <p>{mockTrial.videoInfo.path}</p>
        </div>
        <div>
          <p className="text-white/30">Filename</p>
          <p>{mockTrial.videoInfo.fileName}</p>
        </div>
        <div>
          <p className="text-white/30">Output Folder</p>
          <p>{mockTrial.videoInfo.outputFolder}</p>
        </div>
      </div>
      <div className="flex aspect-video h-fit w-3/4 items-center justify-center rounded-xl border border-white/10">
        Video Preview
      </div>
    </div>
  )
}
