import { TrialInfo } from '@shared/models'

export const mockTrial: TrialInfo = {
  name: 'Mock Trial',
  status: 'setup',
  duration: '0',
  videoInfo: {
    label: 'Logi',
    path: 'Logitech Camera',
    fileName: 'test-video',
    outputFolder: './out/'
  },
  arduinoInfo: {
    path: 'COM11',
    status: 'disconnected',
    primed: false,
    pins: [
      { type: 'led', pin: '13', value: 'off' },
      { type: 'sensor', pin: '12', value: '0' }
    ]
  },
  settings: {},
  data: {
    events: [
      {
        name: 'Beam Broken',
        type: 'beam-break',
        time: new Date().toTimeString()
      }
    ]
  }
}
