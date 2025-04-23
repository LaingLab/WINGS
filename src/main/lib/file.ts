import { parse } from 'csv-parse/sync'
import { createObjectCsvWriter } from 'csv-writer'

import fs from 'fs'
import path from 'path'

import { SAVE_DIR } from '@shared/constants'
import { ArduinoPin, TrialEvent } from '@shared/models'

import { log } from './log'

export let FILE_DIR = SAVE_DIR ?? path.join(__dirname, '../../saved')

const fileLog = (text: string, func?: string) => {
  log(text, `File${func ?? ''}`)
}

// const logsText = readFile('logs', 'txt')
export function readFile(filename: string, filetype: 'txt' | 'json' | 'jsonl' | 'csv') {
  fileLog(`Reading file @ ${filename}.${filetype}`, '.readFile')

  const filePath = path.join(FILE_DIR, `${filename}.${filetype}`)

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return null
  }

  const content = fs.readFileSync(filePath, 'utf-8')

  switch (filetype) {
    case 'txt':
      return content

    case 'json':
      try {
        return JSON.parse(content)
      } catch (err) {
        console.error('Invalid JSON file:', err)
        return null
      }

    case 'jsonl':
      return content
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line)
          } catch {
            return { error: 'Invalid JSON line', line }
          }
        })

    case 'csv':
      try {
        return parse(content, {
          columns: true,
          skip_empty_lines: true
        })
      } catch (err) {
        console.error('Invalid CSV file:', err)
        return null
      }

    default:
      console.warn('Unsupported file type:', filetype)
      return null
  }
}

// const exists = fileExists('myFile.txt');
export function fileExists(filename) {
  fileLog(`Checking if file exists @ ${filename}`, '.fileExists')

  const dirPath = FILE_DIR

  if (!fs.existsSync(dirPath)) {
    fileLog(`ERROR: Directory does not exist`, '.fileExists')
    return false
  }

  const filePath = path.join(dirPath, filename)

  if (fs.existsSync(filePath)) {
    fileLog(`File found!`, '.fileExists')
    return true
  }

  fileLog(`ERROR: File not found`, '.fileExists')
  return false
}

export function listTrials(): string[] {
  fileLog(`Fetching list of trials`, '.listTrials')

  if (!fs.existsSync(FILE_DIR)) {
    fileLog('Saved directory does not exist', '.listTrials')
    return []
  }

  const entries = fs.readdirSync(FILE_DIR, { withFileTypes: true })
  const cleanEntries = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  fileLog(`Found ${cleanEntries.length} trials`, '.listTrials')

  return cleanEntries
}

export function updateFileDir(newDir?: string) {
  if (newDir) {
    fileLog(`Updating file_dir @ ${newDir}`, '.updateFileDir')
    FILE_DIR = SAVE_DIR ?? path.join(__dirname, `../../saved/${newDir}`)
  } else {
    fileLog(`Updating file_dir back to origin`, '.updateFileDir')
    FILE_DIR = SAVE_DIR ?? path.join(__dirname, '../../saved')
  }
  return FILE_DIR
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

export async function convertToCSV(filename: string, filetype: 'json' | 'jsonl') {
  const inputPath = path.join(FILE_DIR, `${filename}.${filetype}`)
  const outputPath = path.join(FILE_DIR, `${filename}.csv`)

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`)
    return
  }

  let records: object[] = []

  try {
    const content = fs.readFileSync(inputPath, 'utf-8')

    if (filetype === 'json') {
      const parsed = JSON.parse(content)
      records = Array.isArray(parsed) ? parsed : [parsed]
    } else if (filetype === 'jsonl') {
      records = content
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    }

    if (records.length === 0) {
      console.warn('No records to convert.')
      return
    }

    // Use first object to infer headers
    const headers = Object.keys(records[0]).map((key) => ({ id: key, title: key }))

    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: headers
    })

    await csvWriter.writeRecords(records)
    console.log(`Converted ${filename}.${filetype} to CSV → ${outputPath}`)
  } catch (err) {
    console.error('Failed to convert to CSV:', err)
  }
}
