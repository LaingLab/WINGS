import { TrialInfo } from './models'

export type RunTrial = (trialInfo: TrialInfo) => void
export type OnTrialLog = (callback) => void
export type ArduinoConnect = () => void
export type PrimeArduino = () => void
export type OnArduinoInfo = (callback) => void
export type OnArduinoPinUpdate = (callback) => void
export type OnArduinoEvent = (callback) => void
