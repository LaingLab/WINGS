import {
  ArduinoConnect,
  OnArduinoEvent,
  OnArduinoInfo,
  OnArduinoPinUpdate,
  OnTrialLog,
  PrimeArduino,
  RunTrial
} from '@shared/types'

declare global {
  interface Window {
    context: {
      arduinoConnect: ArduinoConnect
      runTrial: RunTrial
      primeArduino: PrimeArduino
      onTrialLog: OnTrialLog
      onArduinoInfo: OnArduinoInfo
      onArduinoPinUpdate: OnArduinoPinUpdate
      onArduinoEvent: OnArduinoEvent
    }
  }
}
