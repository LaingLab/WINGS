export type TrialInfo = {
  id: string
  name: string
  status: string
  duration?: string
  videoInfo: VideoInfo
  arduinoInfo: ArduinoInfo
  settings?: TrialSettings
  data?: TrialData
}

export type TrialSettings = {
  idk?: string
}

export type TrialData = {
  events: TrialEvent[]
  results?: TrialResults
  sensorData?: string
  logs?: TrialLog[]
}

export type TrialResults = {
  duration: number
  logFile: string
  dataFile: string
  eventFile: string
  videoFile: string
}

export type TrialEvent = {
  name: string
  type: string
  time: string
}

export type TrialLog = {
  data: string
  time: string
}

export type ArduinoInfo = {
  path: string
  status: string
  primed: boolean
  pins: ArduinoPin[]
}

export type ArduinoPin = {
  id?: string
  pin: string
  type: string | 'led' | 'sensor' | 'swtich'
  value: string
  options?: Record<string, number>
}

export type ArduinoLed = {
  state: string
  pin?: number
  freq?: number
  inputLed?: any
  noLog?: boolean
}

export type ArduinoPump = {
  id?: string
  speed?: number
  state?: string
  pins: [number, number, number]
}

export type VideoInfo = {
  label: string
  path: string
  fileName: string
  outputFolder: string
}
