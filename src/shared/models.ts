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
  pins: Record<string, string>[]
  connectionInfo?: {}
  params?: {}
}

export type VideoInfo = {
  label: string
  path: string
  fileName: string
  outputFolder: string
  params?: {}
}

export type TrialData = {
  events: TrialEvent[]
  sensorData: string
  logs: string
}

export type TrialEvent = {
  name: string
  type: string
  time: string
  params?: {}
}

export type TrialSettings = {}
