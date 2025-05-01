export type TrialInfo = {
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
  label: string
}

export type ArduinoSettings = {
  path: string
  pins: ArduinoPin[]
}

export type ArduinoPin = {
  pin: string
  type: string
  value?: string
  timestamp?: string
  opts?: ArduinoPinOpts
}

export type ArduinoPinOpts = {
  additionalPins?: ArduinoPin[]
  startState?: string
  frequency?: number
  speed?: number
  inputLed?: string
  noLog?: boolean
  threshold?: number
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

export type TrialData = {
  id: string
  status: string
  duration: number
  videoPath: string
  logs: Log[]
  events: Event[]
  arduinoData: ArduinoData
}

export type ArduinoData = {
  status: string
  primed: boolean
  pins: ArduinoPin[]
}

export type Log = {
  time: string
  type: string
  data: string
}

export type Event = {
  time: string
  type: string
  data: string
}

export type TrialResults = {
  id: string
  endTime: string
  trialInfo: TrialInfo
  trialData: TrialData
}
