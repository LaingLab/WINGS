import { TrialInfo } from './models'

export const SAVE_DIR = '/home/labian/Documents/GLIDE/GLIDE_Test-1/'

export const defaultTrialInfo: TrialInfo = {
  name: '',
  status: 'setup',
  duration: '',
  videoInfo: {
    label: '',
    path: '',
    fileName: '',
    outputFolder: SAVE_DIR
  },
  arduinoInfo: {
    path: '',
    status: 'disconnected',
    primed: false,
    pins: []
  },
  settings: {},
  data: {
    logs: [],
    events: [],
    sensorData: ''
  }
}
