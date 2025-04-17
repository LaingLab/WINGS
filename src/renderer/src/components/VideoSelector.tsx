import { isRecordingAtom, tempTrialInfoAtom } from '@/store'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

export const VideoSelector = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [tempTrialInfo, setTempTrialInfo] = useAtom(tempTrialInfoAtom)
  const isRecording = useAtomValue(isRecordingAtom)

  useEffect(() => {
    async function fetchDevices() {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices()
      setDevices(mediaDevices.filter((device) => device.kind === 'videoinput'))
    }
    fetchDevices()
  }, [])

  const handleSelect = (e) => {
    const device = devices.filter((device) => device.deviceId == e.target.value)
    setTempTrialInfo((prev) => {
      return {
        ...prev,
        videoInfo: {
          ...prev.videoInfo,
          label: device[0]?.label || '',
          path: e.target.value
        }
      }
    })
  }

  return (
    <select
      className="bg-bg w-full rounded-md border border-white/20 bg-neutral-800 p-2.5 text-sm text-white duration-150"
      onChange={handleSelect}
      value={tempTrialInfo.videoInfo.path}
      disabled={isRecording}
    >
      <option value="">Select a camera</option>
      {devices.map((device) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label || `Camera ${device.deviceId}`}
        </option>
      ))}
    </select>
  )
}
