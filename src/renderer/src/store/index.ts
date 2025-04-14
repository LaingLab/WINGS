import { TrialInfo } from '@shared/models'
import { atom } from 'jotai'

export const isRecordingAtom = atom(false)
export const outputPathAtom = atom(null)
export const selectedMediaDeviceAtom = atom<string | null>(null)

export const trialInfoAtom = atom<TrialInfo>({
  name: '',
  status: 'setup',
  duration: '',
  videoInfo: {
    label: '',
    path: '',
    fileName: '',
    outputFolder: ''
  },
  arduinoInfo: {
    path: '',
    status: 'disconnected',
    pins: []
  },
  settings: {},
  data: {
    events: [],
    sensorData: '',
    logs: ''
  }
})
