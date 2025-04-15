import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // File
    fileExists: (filenme) => ipcInvoke('file-exists', filenme),
    readFile: (params: { filename; filetype }) => ipcInvoke('read-file', params),
    saveTrialInfo: (trialInfo) => ipcInvoke('save-trial-info', trialInfo),
    deleteTrialInfo: () => ipcInvoke('delete-trial-info'),

    // Trial
    runTrial: (trialInfo) => ipcInvoke('run-trial', trialInfo),

    // Arduino
    arduinoConnect: () => ipcInvoke('arduino-connect'),
    primeArduino: () => ipcInvoke('prime-aruino'),

    // Event Listeners
    onTrialLog: (callback) => ipcOn('trial-log', callback),
    onArduinoInfo: (callback) => ipcOn('arduino-info', callback),
    onArduinoPinUpdate: (callback) => ipcOn('arduino-pin', callback),
    onArduinoEvent: (callback) => ipcOn('arduino-event', callback)
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
