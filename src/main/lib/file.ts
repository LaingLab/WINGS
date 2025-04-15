import { ArduinoPin, TrialEvent } from '@shared/models'
import { parse } from 'csv-parse/sync'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'

export function saveUserData(data: object): void {
  const dir = path.join(__dirname, 'saved')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'userData.json')
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✅ Saved userData to ${filePath}`)
}

export function saveTxtLog(message: string) {
  const logDir = path.join(__dirname, 'saved')
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

  const logPath = path.join(logDir, 'logs.txt')
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${message}\n`

  fs.appendFileSync(logPath, line, 'utf-8')
}

export function saveSensorReading(sensorData: ArduinoPin) {
  const dir = path.join(__dirname, 'saved')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'sensor_readings.jsonl')

  const entry = {
    timestamp: new Date().toISOString(),
    ...sensorData
  }

  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8')
}

export function saveEvent(eventData: TrialEvent) {
  const dir = path.join(__dirname, 'saved')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const filePath = path.join(dir, 'events.jsonl')

  const entry = {
    timestamp: new Date().toISOString(),
    ...eventData
  }

  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8')
}

export async function convertToCSV(filename: string, filetype: 'json' | 'jsonl') {
  const inputPath = path.join(__dirname, 'saved', `${filename}.${filetype}`)
  const outputPath = path.join(__dirname, 'saved', `${filename}.csv`)

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`)
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
      console.warn('⚠️ No records to convert.')
      return
    }

    // Use first object to infer headers
    const headers = Object.keys(records[0]).map((key) => ({ id: key, title: key }))

    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: headers
    })

    await csvWriter.writeRecords(records)
    console.log(`✅ Converted ${filename}.${filetype} to CSV → ${outputPath}`)
  } catch (err) {
    console.error('❌ Failed to convert to CSV:', err)
  }
}

export function readFile(filename: string, filetype: 'txt' | 'json' | 'jsonl' | 'csv') {
  const filePath = path.join(__dirname, 'saved', `${filename}.${filetype}`)

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

// const logsText = readFile('logs', 'txt')
// console.log(logsText)
