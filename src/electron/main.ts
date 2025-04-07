import { ipcMainHandle, ipcMainOn, isDev } from "./utils/utils.js";
import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import fs from "fs";

import createTray from "./utils/tray.js";
import createMenu from "./utils/menu.js";

import pathResolver from "./pathResolver.js";
import managers from "./managers.js";

export let mainWindow: BrowserWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    webPreferences: {
      preload: pathResolver.getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  console.log(
    "\n\n----------------------- Created Window -----------------------\n",
  );
}

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}

// Wait for app to start then open window
app.on("ready", () => {
  createMainWindow();

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(pathResolver.getUIPath());
  }

  ipcMainOn("sendFrameAction", (payload) => {
    switch (payload) {
      case "CLOSE":
        mainWindow.close();
        break;
      case "MAXIMIZE":
        mainWindow.maximize();
        break;
      case "MINIMIZE":
        mainWindow.minimize();
        break;
    }
  });

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
});

// Exit app on window close
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMainOn("test-send", (params) => {
  console.log("Received params:", params);

  mainWindow.webContents.send(
    "test-on",
    `[Main] Recieved from renderer: ${params}`,
  );
  return;
});

ipcMainHandle("io", async (type) => {
  switch (type) {
    case "get-serial-devices":
      return await managers.ioManager.getSerialDevices();
  }
});

ipcMainHandle("recording", async (type, params) => {
  switch (type) {
    case "start-recording":
      return { success: true, message: "Recording started" };
    case "select-output-folder":
      try {
        const { filePath } = await dialog.showSaveDialog({
          title: "Save Recording As",
          defaultPath: `recording-${Date.now()}.mp4`,
          filters: [{ name: "Videos", extensions: ["mp4", "webm"] }],
        });

        return filePath;
      } catch (error) {
        return console.error(`Failed to select output folder: `, error);
      }
      break;
    case "save-recording-file":
      {
        const { fileName, data } = params;
        const filePath = path.join(
          pathResolver.getProjectDirectory(),
          `/recordings/${fileName}.mp4`,
        );
        fs.writeFileSync(filePath, Buffer.from(data));
        return { success: true, filePath };
      }
      break;
  }
});

ipcMainHandle("arduino", async (type, params) => {
  switch (type) {
    case "connect":
      return managers.arduinoManager.connect(params?.path ? params.path : null);
    case "prime":
      return managers.arduinoManager.prime();
    case "unprime":
      return managers.arduinoManager.unprime();
    case "disconnect":
      return managers.arduinoManager.disconnect();
    case "test-lights":
      return managers.arduinoManager.testLights();
    case "toggle-led":
      return managers.arduinoManager.toggleLed(params?.pin, params?.state);
  }
});
