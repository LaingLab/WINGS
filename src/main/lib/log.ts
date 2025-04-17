import { mainWindow } from '..'
import { saveTxtLog } from './file'

export const log = (text: string, type?: string, save?: boolean) => {
  const prefix = `[${type ?? 'APP'}]`

  console.log(prefix, text)

  mainWindow.webContents.send('trial-log', `${text}`)

  if (save) {
    saveTxtLog(`${prefix} ${text}`)
  }
}
