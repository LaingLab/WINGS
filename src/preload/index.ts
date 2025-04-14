import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    runTrial: (trialInfo) => ipcInvoke('run-trial', trialInfo),
    onTrialLog: (callback) => ipcOn('trial-log', callback),
    arduinoConnect: () => ipcInvoke('arduino-connect'),
    primeArduino: () => ipcInvoke('prime-aruino'),
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

function ipcOn(key, callback) {
  console.log(`Adding listener for ${key}`)
  const wrappedCallback = (_event, ...args) => callback(...args)
  ipcRenderer.on(key, wrappedCallback)
  return () => ipcRenderer.off(key, wrappedCallback) && ipcRenderer.removeAllListeners(key)
}

function ipcSend(key, payload) {
  console.log(`Sending ${key} with payload:`, payload)
  ipcRenderer.send(key, payload)
}
