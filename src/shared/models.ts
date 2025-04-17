export type TrialInfo = {
  name?: string
  status: string
  duration?: string
  videoInfo: VideoInfo
  arduinoInfo: ArduinoInfo
  settings?: TrialSettings
  data?: TrialData
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

export type VideoInfo = {
  label: string
  path: string
  fileName: string
  outputFolder: string
}

export type TrialData = {
  events: TrialEvent[]
  sensorData?: string
  logs?: TrialLog[]
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

export type TrialSettings = {
  idk?: string
}
