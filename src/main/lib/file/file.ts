import { parse } from 'csv-parse/sync'
import { createObjectCsvWriter } from 'csv-writer'

import fs from 'fs'
import path from 'path'

import { SAVE_DIR } from '@shared/constants'

import { log } from '../log'

export let FILE_DIR = SAVE_DIR ?? path.join(__dirname, '../../saved')

const fileLog = (text: string, func?: string) => {
  log(text, `File${func ?? ''}`)
}

/**
 *
 * @param newDir - New directory to set
 * @returns {string} - Updated directory path
 * @description - Updates the file directory to the specified new directory.
 * If no new directory is provided, it resets to the original directory.
 */
export function updateFileDir(newDir?: string): string {
  if (newDir) {
    fileLog(`Updating file_dir @ ${newDir}`, '.updateFileDir')
    FILE_DIR = SAVE_DIR ?? path.join(__dirname, `../../saved/${newDir}`)
  } else {
    fileLog(`Updating file_dir back to origin`, '.updateFileDir')
    FILE_DIR = SAVE_DIR ?? path.join(__dirname, '../../saved')
  }
  return FILE_DIR
}

/**
 * @returns {{ id: string; name: string }[]} - List of trial directories
 * @description - Lists all filenames / foldernames present in the saved directory.
 */
export function listFiles(): { id: string; name: string }[] {
  fileLog(`Fetching list of trials`, '.listTrials')

  if (!fs.existsSync(FILE_DIR)) {
    fileLog('Saved directory does not exist', '.listTrials')
    return []
  }

  // Read all files in the directory, if a folder is found, look for the trialInfo.json file and pull the name
  const entries = fs.readdirSync(FILE_DIR, { withFileTypes: true })

  // Read all trialInfo.json files in the directory and return the id and name
  const trials = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const trialDir = path.join(FILE_DIR, entry.name)
      const trialInfoPath = path.join(trialDir, 'trialInfo.json')

      if (fs.existsSync(trialInfoPath)) {
        const trialInfo = JSON.parse(fs.readFileSync(trialInfoPath, 'utf-8'))
        return { id: trialInfo.id, name: trialInfo.name }
      }
      return null
    })
    .filter(Boolean)
    .map((trial) => trial as { id: string; name: string })
    .sort((a, b) => (a.name > b.name ? 1 : -1))
  return trials
}

/**
 *
 * @param filename - Name of the file to read
 * @param filetype - Type of the file to read
 * @returns {string | object[] | null} - Content of the file
 * @description - Reads a file and returns its content. Supports txt, json, jsonl, and csv formats.
 */
export function readFile(
  filename: string,
  filetype: 'txt' | 'json' | 'jsonl' | 'csv'
): string | object[] | null {
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

/**
 * @param filename - Name of the file to check
 * @returns {boolean} - True if the file exists, false otherwise
 * @description - Checks if a file exists in the saved directory.
 */
export function fileExists(filename: string): boolean {
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
