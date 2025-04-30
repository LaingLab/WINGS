import {
  ArduinoConnect,
  DeleteTrialInfo,
  EndTrial,
  FileExists,
  ListTrials,
  OnArduinoEvent,
  OnArduinoInfo,
  OnArduinoPinUpdate,
  OnTrialInfo,
  OnTrialLog,
  OnVideoControl,
  PrimeArduino,
  ReadFile,
  RunTrial,
  SaveTrialInfo,
  SaveTrialResults,
  ToggleLed,
  TogglePump,
  UpdateFileDir
} from '@shared/types'

declare global {
  interface Window {
    context: {
      // File
      fileExists: FileExists
      readFile: ReadFile
      saveTrialInfo: SaveTrialInfo
      saveTrialResults: SaveTrialResults
      deleteTrialInfo: DeleteTrialInfo
      listTrials: ListTrials
      updateFileDir: UpdateFileDir

      // Trial
      runTrial: RunTrial
      endTrial: EndTrial

      // Arduino
      arduinoConnect: ArduinoConnect
      primeArduino: PrimeArduino
      toggleLed: ToggleLed
      togglePump: TogglePump

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
