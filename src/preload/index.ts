import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // File
    fileExists: (filename) => ipcInvoke('file-exists', filename),
    readFile: (params: { filename; filetype }) => ipcInvoke('read-file', params),
    saveTrialInfo: (trialInfo) => ipcInvoke('save-trial-info', trialInfo),
    saveTrialResults: (trialResults) => ipcInvoke('save-trial-results', trialResults),
    deleteTrialInfo: () => ipcInvoke('delete-trial-info'),
    listTrials: () => ipcInvoke('list-trials'),
    updateFileDir: (trialFolder: string) => ipcInvoke('update-file-dir', trialFolder),

    // Trial
    runTrial: (trialInfo) => ipcInvoke('run-trial', trialInfo),
    endTrial: (trialResults) => ipcInvoke('end-trial', trialResults),

    // Arduino
    arduinoConnect: () => ipcInvoke('arduino-connect'),
    primeArduino: () => ipcInvoke('prime-aruino'),
    toggleLed: (params) => ipcInvoke('toggle-led', params),
    togglePump: (params) => ipcInvoke('toggle-pump', params),

    // Video
    startRecording: () => ipcInvoke('video:start-recording'),
    writeVideoChunk: (data) => ipcInvoke('video:write-chunk', data),
    stopRecording: (id) => ipcInvoke('video:stop-recording', id),

    // Event Listeners
    onTrialLog: (callback) => ipcOn('trial-log', callback),
    onTrialInfo: (callback) => ipcOn('trial-info', callback),
    onArduinoInfo: (callback) => ipcOn('arduino-info', callback),
    onArduinoPinUpdate: (callback) => ipcOn('arduino-pin', callback),
    onArduinoEvent: (callback) => ipcOn('arduino-event', callback),
    onVideoControl: (callback) => ipcOn('video-control', callback)
  })
} catch (error) {
  console.error(error)
}

const ipcInvoke = (key, ...args) => {
  console.log(`Invoking ${key} with args:`, args)
  return ipcRenderer.invoke(key, ...args)
}

const ipcOn = (key, callback) => {
  console.log(`Adding listener for ${key}`)
  const wrappedCallback = (_event, ...args) => callback(...args)
  ipcRenderer.on(key, wrappedCallback)
  return () => ipcRenderer.off(key, wrappedCallback) && ipcRenderer.removeAllListeners(key)
}

const ipcSend = (key, payload) => {
  console.log(`Sending ${key} with payload:`, payload)
  ipcRenderer.send(key, payload)
}
