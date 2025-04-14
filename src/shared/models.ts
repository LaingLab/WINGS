export type TrialInfo = {
  name: string
  status: string
  duration: number
  videoInfo: VideoInfo
  arduinoInfo: ArduinoInfo
  settings: TrialSettings
  data?: TrialData
}

export type ArduinoInfo = {
  path: string
  pins: Record<string, string>[]
  connectionInfo?: {}
  params?: {}
}

export type VideoInfo = {
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
