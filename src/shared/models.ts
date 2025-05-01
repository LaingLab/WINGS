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
  pins: Pin[]
}

export type Pin = {
  type: 'pin' | 'led' | 'pump' | 'sensor' | 'switch'
  pin: string
  pins?: number[]
  active?: boolean
  log?: boolean
  label?: string
  state?: string
  value?: string
  timestamp?: string
}

export interface Led extends Pin {
  frequency?: number
  inputLed?: string
}

export interface Pump extends Pin {
  speed?: number
}

export interface Sensor extends Pin {
  freqency?: number
  threshold?: number
}

export interface Switch extends Pin {
  debounce?: number
  delay?: number
  action?: any
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
  pins: Pin[]
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
