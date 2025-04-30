import { mainWindow } from '..'
import { saveTxtLog } from './file'

export const log = (text: string, type?: string, send?: boolean) => {
  const prefix = `[${type ?? 'APP'}]`

  console.log(prefix, text)

  saveTxtLog(`${prefix} ${text}`)

  const newLog = {
    type: type ?? 'APP',
    time: new Date().toLocaleString(),
    data: text
  }

  // Only send if mainWindow exists and is not destroyed.
  if (!send && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('trial-log', JSON.stringify(newLog))
  }
}
