import fs from 'fs'
import path from 'path'

import { ArduinoPin, TrialEvent } from '@shared/models'

import { log } from '../log'
import { FILE_DIR } from './file'

const fileLog = (text: string, func?: string) => {
  log(text, `File-Save${func ?? ''}`)
}

export function saveTrialInfo(data: object): void {
  fileLog(`Saving trial info @ ${FILE_DIR}/trialInfo.json`, '.saveTrialInfo')

  const dir = FILE_DIR
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'trialInfo.json')
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`Saved userData to ${filePath}`)
}

export function deleteTrialInfo() {
  fileLog(`Delecting trial info @ ${FILE_DIR}/trialInfo.json`, '.deleteTrialInfo')
  const filePath = path.join(FILE_DIR, 'trialInfo.json')

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    fileLog('File deleted successfully', '.deleteTrialInfo')
  } else {
    fileLog('File does not exist', '.deleteTrialInfo')
  }
}

export function saveTrialResults(data: object): void {
  fileLog(`Saving trial results @ ${FILE_DIR}/trialResults.json`, '.saveTrialResults')
  const dir = FILE_DIR
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'trialResults.json')
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function saveTxtLog(message: string) {
  const logDir = FILE_DIR
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

  const logPath = path.join(logDir, 'logs.txt')
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${message}\n`

  fs.appendFileSync(logPath, line, 'utf-8')
}

export function saveSensorReading(sensorData: ArduinoPin) {
  const dir = FILE_DIR
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'sensor_readings.jsonl')

  const entry = {
    timestamp: new Date().toISOString(),
    ...sensorData
  }

  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8')
}

export function saveEvent(eventData: TrialEvent) {
  const dir = FILE_DIR
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'events.jsonl')

  const entry = {
    timestamp: new Date().toISOString(),
    ...eventData
  }

  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8')
}
