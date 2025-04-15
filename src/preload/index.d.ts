import {
  ArduinoConnect,
  DeleteTrialInfo,
  EndTrial,
  FileExists,
  OnArduinoEvent,
  OnArduinoInfo,
  OnArduinoPinUpdate,
  OnTrialLog,
  PrimeArduino,
  ReadFile,
  RunTrial,
  SaveTrialInfo
} from '@shared/types'

declare global {
  interface Window {
    context: {
      // File
      fileExists: FileExists
      readFile: ReadFile
      saveTrialInfo: SaveTrialInfo
      deleteTrialInfo: DeleteTrialInfo

      // Trial
      runTrial: RunTrial
      endTrial: EndTrial

      // Arduino
      arduinoConnect: ArduinoConnect
      primeArduino: PrimeArduino

      // Video

      // Event Listeners
      onTrialLog: OnTrialLog
      onArduinoInfo: OnArduinoInfo
      onArduinoPinUpdate: OnArduinoPinUpdate
      onArduinoEvent: OnArduinoEvent
    }
  }
}
