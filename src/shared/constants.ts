import { TrialData, TrialInfo } from './models'

// = '/home/labian/Documents/GLIDE/GLIDE_Test-1/'
export const SAVE_DIR = null

export const defaultTrialInfo: TrialInfo = {
  id: '',
  name: '',
  description: '',
  dateCreated: '',
  lastOpened: '',
  settings: {
    video: {
      path: '',
      label: ''
    },
    arduino: {
      path: '',
      pins: []
    }
  }
}

export const defaultTrialData: TrialData = {
  id: '',
  status: 'idle',
  duration: 0,
  logs: [],
  events: [],
  arduinoData: {
    status: 'idle',
    primed: false,
    pins: []
  }
}
