type Trial = {
  name: string
  status: string
  videoInfo: VideoInfo
  arduinoInfo: ArduinoInfo
  settings: TrialSettings
  data: TrialData
}

type ArduinoInfo = {
  path: string
  pins: Record<string, number>[]
  connectionInfo: {}
  params: {}
}

type VideoInfo = {
  path: string
  fileName: string
  outputFolder: string
  params: {}
}

type TrialData = {
  events: TrialEvent[]
  sensorData: {}
  logs: string
}

type TrialEvent = {
  name: string
  type: string
  time: string
  params: {}
}

type TrialSettings = {}
