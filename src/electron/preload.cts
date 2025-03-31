import electron from "electron";

interface Recording {
  name: string;
  path: string;
  url: string;
  created: number;
}

const ipcInvoke = (key, ...args) => {
  console.log(`Preload: Invoking ${key} with args:`, args);
  return electron.ipcRenderer.invoke(key, ...args);
};

electron.contextBridge.exposeInMainWorld("electronIPC", {
  sendFrameAction: (payload) => ipcSend("sendFrameAction", payload),
  arduino: async (type, params) => ipcInvoke("arduino", type, params),
  recording: async (type, params) => ipcInvoke("recording", type, params),
  io: async (type, params) => ipcInvoke("io", type, params),
  // ipcInvoke
  testInvoke: async (params) => ipcInvoke("test-invoke", params),

  // ipcSend
  testSend: async (params) => ipcSend("test-send", params),

  // ipcOn
  testOn: (callback) => ipcOn("test-on", callback),
});

function ipcOn(key, callback) {
  const wrappedCallback = (_event, ...args) => callback(...args);
  electron.ipcRenderer.on(key, wrappedCallback);
  return () =>
    electron.ipcRenderer.off(key, wrappedCallback) &&
    electron.ipcRenderer.removeAllListeners(key);
}

function ipcSend(key, payload) {
  electron.ipcRenderer.send(key, payload);
}
