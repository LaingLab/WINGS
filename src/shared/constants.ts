import { TrialInfo } from './models'

// = '/home/labian/Documents/GLIDE/GLIDE_Test-1/'
export const SAVE_DIR = null

export const defaultTrialInfo: TrialInfo = {
  id: '',
  name: 'New-Trial',
  status: 'setup',
  duration: '',
  videoInfo: {
    label: '',
    path: '',
    fileName: '',
    outputFolder: SAVE_DIR ?? ''
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
