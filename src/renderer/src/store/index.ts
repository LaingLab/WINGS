import { defaultTrialInfo } from '@shared/constants'
import { ArduinoInfo, TrialEvent, TrialInfo, TrialLog } from '@shared/models'
import { atom } from 'jotai'

// Trial Atoms
export const trialInfoAtom = atom<TrialInfo>(defaultTrialInfo)
export const tempTrialInfoAtom = atom<TrialInfo>(defaultTrialInfo)
export const trialLogsAtom = atom<TrialLog[]>([
  { data: 'Welcome! Run a trial to collect some logs...', time: new Date().toLocaleTimeString() }
])

// Video Atoms
export const isRecordingAtom = atom(false)
export const outputPathAtom = atom(null)
export const selectedMediaDeviceAtom = atom<string | null>(null)

// Event Atoms
export const eventInfoAtom = atom<TrialEvent[] | null>((get) => {
  const trialInfo = get(trialInfoAtom)
  const eventInfo = trialInfo.data?.events

  return eventInfo ?? []
})

// Arduino Atoms
export const arduinoInfoAtom = atom<ArduinoInfo>((get) => {
  const trialInfo = get(trialInfoAtom)
  const arduinoInfo = trialInfo.arduinoInfo

  return arduinoInfo
})
