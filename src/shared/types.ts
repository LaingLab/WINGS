import { TrialInfo } from './models'

// File
export type FileExists = (filename: string) => boolean
export type ReadFile = (params: {
  filename: string
  filetype: 'txt' | 'json' | 'jsonl' | 'csv'
}) => object
export type SaveTrialInfo = (trialInfo: TrialInfo) => void
export type DeleteTrialInfo = () => void

// Trial
export type RunTrial = (trialInfo: TrialInfo) => void
export type EndTrial = () => void

// Arduino
export type ArduinoConnect = () => void
export type PrimeArduino = () => void

// Video

// Event Listener
export type OnTrialLog = (callback) => void
export type OnArduinoInfo = (callback) => void
export type OnArduinoPinUpdate = (callback) => void
export type OnArduinoEvent = (callback) => void
