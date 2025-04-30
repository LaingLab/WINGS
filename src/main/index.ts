import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'

import {
  connect,
  deleteTrialInfo,
  endTrial,
  fileExists,
  listFiles,
  log,
  prime,
  readFile,
  runTrial,
  saveTrialInfo,
  saveTrialResults,
  setupVideoHandlers,
  toggleLed,
  togglePump,
  updateFileDir
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
      contextIsolation: true,
      webSecurity: false
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
  setupVideoHandlers()
  createWindow()

  log('App ready', 'Main')

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS.
  if (process.platform !== 'darwin') {
    log('App Closed', 'Main')
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
  ipcMain.handle('save-trial-results', (_, trialResults) => saveTrialResults(trialResults))
  ipcMain.handle('delete-trial-info', () => deleteTrialInfo())
  ipcMain.handle('list-trials', () => listFiles())
  ipcMain.handle('update-file-dir', (_, trialFolder: string) => {
    return updateFileDir(trialFolder)
  })

  // Trial
  ipcMain.handle('run-trial', (_, trialInfo) => runTrial(trialInfo))
  ipcMain.handle('end-trial', (_, trialResults) => endTrial(trialResults))

  // Arduino
  ipcMain.handle('arduino-connect', () => connect())
  ipcMain.handle('prime-aruino', () => prime())
  ipcMain.handle('toggle-led', async (_, params) => {
    await toggleLed(params)
    return null
  })
  ipcMain.handle('toggle-pump', async (_, params) => {
    await togglePump(params)
    return null
  })

  // Video
}
