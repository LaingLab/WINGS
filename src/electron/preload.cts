import electron from "electron";

electron.contextBridge.exposeInMainWorld("electronIPC", {
  // Custom Methods
  io: async (type, params) => ipcInvoke("io", type, params),

  recording: async (type, params) => ipcInvoke("recording", type, params),

  arduino: async (type, params) => ipcInvoke("arduino", type, params),
  onArduinoUpdate: (callback) => ipcOn("arduino-update", callback),
  onArduinoSensor: (callback) => ipcOn("arduino-sensor", callback),
  onArduinoLog: (callback) => ipcOn("arduino-log", callback),

  // Frame Actions
  sendFrameAction: (payload) => ipcSend("sendFrameAction", payload),

  // Default Methods
  testInvoke: async (params) => ipcInvoke("test-invoke", params),
  testSend: async (params) => ipcSend("test-send", params),
  testOn: (callback) => ipcOn("test-on", callback),
});

const ipcInvoke = (key, ...args) => {
  console.log(`Invoking ${key} with args:`, args);
  return electron.ipcRenderer.invoke(key, ...args);
};

function ipcOn(key, callback) {
  console.log(`Adding listener for ${key}`);
  const wrappedCallback = (_event, ...args) => callback(...args);
  electron.ipcRenderer.on(key, wrappedCallback);
  return () =>
    electron.ipcRenderer.off(key, wrappedCallback) &&
    electron.ipcRenderer.removeAllListeners(key);
}

function ipcSend(key, payload) {
  console.log(`Sending ${key} with payload:`, payload);
  electron.ipcRenderer.send(key, payload);
}
