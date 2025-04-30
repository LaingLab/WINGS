export type Trial = {
  id: string
  name: string
  description: string
  dateCreated: string
  lastOpened: string
  settings: TrialSettings
}

export type TrialSettings = {
  video: VideoSettings
  arduino: ArduinoSettings
}

export type VideoSettings = {
  path: string
}

export type ArduinoSettings = {
  path: string
  pins: ArduinoPin[]
}

export type ArduinoPin = {
  pin: string
  type: string
  value?: string
  opts?: ArduinoPinOpts
}

export type ArduinoPinOpts = {
  additionalPins?: ArduinoPin[]
  startState?: string
  frequency?: number
  speed?: number
  inputLed?: string
  noLog?: boolean
}

export type TrialData = {
  id: string
  status: string
  duration: number
  logs: Log[]
  events: Event[]
  arduinoData: ArduinoData
}

export type Log = {
  time: string
  type: string
  data: string
}

export type Event = {
  time: string
  type: string
}

export type ArduinoData = {
  status: string
  primed: boolean
  pins: ArduinoPin[]
}

export type TrialResults = {
  id: string
  endTime: string
  trialInfo: Trial
  trialData: TrialData
}
