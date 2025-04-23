import { mainWindow } from '..'
import { saveTxtLog } from './file'

export const log = (text: string, type?: string, send?: boolean) => {
  const prefix = `[${type ?? 'APP'}]`

  console.log(prefix, text)

  saveTxtLog(`${prefix} ${text}`)

  if (!send) {
    mainWindow.webContents.send('trial-log', `${prefix} ${text}`)
  }
}
