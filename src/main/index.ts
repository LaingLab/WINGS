import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'

import {
  connect,
  deleteTrialInfo,
  endTrial,
  fileExists,
  prime,
  readFile,
  runTrial,
  saveTrialInfo
} from '@/lib'

import icon from '../../resources/icon.png?asset'

export let mainWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    center: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcEvents()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const ipcEvents = () => {
  // File
  ipcMain.handle('file-exists', (_, filename) => fileExists(filename))
  ipcMain.handle(
    'read-file',
    (_, params: { filename: string; filetype: 'txt' | 'json' | 'jsonl' | 'csv' }) =>
      readFile(params.filename, params.filetype)
  )
  ipcMain.handle('save-trial-info', (_, trialInfo) => saveTrialInfo(trialInfo))
  ipcMain.handle('delete-trial-info', () => deleteTrialInfo())

  // Trial
  ipcMain.handle('run-trial', (_, trialInfo) => runTrial(trialInfo))
  ipcMain.handle('end-trial', () => endTrial())

  // Arduino
  ipcMain.handle('arduino-connect', () => connect())
  ipcMain.handle('prime-aruino', () => prime())

  // Video
}
