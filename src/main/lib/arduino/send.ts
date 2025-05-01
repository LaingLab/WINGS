import { Pin } from '@shared/models'
import { mainWindow } from '../..'

import { saveEvent, saveSensorReading } from '../file'
import { log } from '../log'

export const sendEvent = (data) => {
  log(`${JSON.stringify(data)}`, 'Arduino-Send.sendEvent')
  mainWindow.webContents.send('arduino-event', JSON.stringify(data))
  saveEvent(data)
}

export const updateInfo = (data) => {
  log(`${JSON.stringify(data)}`, 'Arduino-Send.updateInfo')
  mainWindow.webContents.send('arduino-info', JSON.stringify(data))
}

export const updatePin = (data: string | null, object?: Pin) => {
  if (data) {
    log(data, 'Arduino-Send.updatePin')
    mainWindow.webContents.send('arduino-pin', data)
    saveSensorReading(JSON.parse(data))
  } else if (object) {
    log(`${JSON.stringify(object)}`, 'Arduino-Send.updatePin')
    mainWindow.webContents.send('arduino-pin', JSON.stringify(object))
    saveSensorReading(object)
  }
}
