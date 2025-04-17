import { ArduinoPin } from '@shared/models'
import { mainWindow } from '../..'
import { saveEvent, saveSensorReading, saveTxtLog } from '../file'

export const sendLog = (message: string) => {
  console.log(`[Arduino] <LOG> ${message}`)
  mainWindow.webContents.send('trial-log', `${message}`)
  saveTxtLog(`[Arduino] ${message}`)
}

export const updateInfo = (data) => {
  console.log(`[Arduino] <INFO> ${JSON.stringify(data)}`)
  mainWindow.webContents.send('arduino-info', JSON.stringify(data))
}

export const updatePin = (data: string | null, object?: ArduinoPin) => {
  // console.log(`[Arduino] <PIN> ${data}`)
  if (data) {
    mainWindow.webContents.send('arduino-pin', data)
    saveSensorReading(JSON.parse(data))
  } else if (object) {
    mainWindow.webContents.send('arduino-pin', JSON.stringify(object))
    saveSensorReading(object)
  }
}

export const sendEvent = (data) => {
  console.log(`[Arduino] <EVENT> ${JSON.stringify(data)}`)
  mainWindow.webContents.send('arduino-event', JSON.stringify(data))
  saveEvent(data)
}
