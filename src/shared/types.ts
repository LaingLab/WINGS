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
export type ListTrials = () => Promise<string[]>
export type UpdateFileDir = (trialFolder?: string) => any

// Arduino
export type ArduinoConnect = () => void
export type PrimeArduino = () => void
export type ToggleLed = (params: {
  state: string
  pin?: number
  freq?: number
  inputLed?: any
}) => void
export type TogglePump = (params: {
  pins: [number, number, number]
  state: string
  speed?: number
}) => void

// Video
export type StartRecording = (options: {
  fileName?: string
  outputFolder?: string
  format?: 'webm' | 'mp4' | 'mov' | 'avi'
}) => Promise<{ recordingId: string; filePath: string }>

export type WriteVideoChunk = (data: {
  recordingId: string
  chunk: ArrayBuffer
}) => Promise<{ success: boolean; chunksWritten: number }>

export type StopRecording = (data: {
  recordingId: string
}) => Promise<{ success: boolean; filePath: string; totalChunks: number }>

// Event Listener
export type OnTrialLog = (callback) => void
export type OnTrialInfo = (callback) => void

export type OnArduinoInfo = (callback) => void
export type OnArduinoPinUpdate = (callback) => void
export type OnArduinoEvent = (callback) => void

export type OnVideoControl = (callback: (command: string) => void) => () => void
