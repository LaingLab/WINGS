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
    outputFolder: '/home/labian/Documents/GLIDE/GLIDE_Test-1/output'
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
