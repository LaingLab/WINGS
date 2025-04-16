import {
  ArduinoConnect,
  DeleteTrialInfo,
  EndTrial,
  FileExists,
  OnArduinoEvent,
  OnArduinoInfo,
  OnArduinoPinUpdate,
  OnTrialInfo,
  OnTrialLog,
  OnVideoControl,
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
      startRecording: StartRecording
      writeVideoChunk: WriteVideoChunk
      stopRecording: StopRecording

      // Event Listeners
      onTrialLog: OnTrialLog
      onTrialInfo: OnTrialInfo

      onArduinoInfo: OnArduinoInfo
      onArduinoPinUpdate: OnArduinoPinUpdate
      onArduinoEvent: OnArduinoEvent

      onVideoControl: OnVideoControl
    }
  }
}
