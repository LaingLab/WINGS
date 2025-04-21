/** 
Trial Runtime
    1. Start trial called
    2. Initialize devices
    3. Start recording
    4. Event loop
    5. Save data and logs (should be automatic)
*/

import { TrialInfo } from '@shared/models'
import { mainWindow } from '..'
import { connect, initBoard } from './arduino'
import { convertToCSV, updateFileDir } from './file'
import { log as logFn } from './log'
import { wait } from './utils'

const logPrefix = 'Trial'

let running = false
let duration = 0
let countInterval

const statusUpdate = (status: string) => {
  const update = {
    status
  }
  mainWindow.webContents.send('trial-info', JSON.stringify(update))
}

// Run trial
export async function runTrial(trialInfo: TrialInfo) {
  log(`Starting trial... ${JSON.stringify(trialInfo)}`)
  running = true

  // Set Trial Folder to save to
  updateFileDir(`${trialInfo.name}`)
  log(`Starting trial... ${JSON.stringify(trialInfo)}`)

  try {
    await connect(trialInfo.arduinoInfo.path, trialInfo.arduinoInfo.pins)

    await initBoard()
  } catch (error) {
    log('Failed to connect to the board: skipping board initialization.')
  }

  await wait(3000)

  // Start Recording
  log(`Starting video recording...`)
  mainWindow.webContents.send('video-control', 'start-recording')

  log(`Trial started!`)
  statusUpdate('started')

  countInterval = setInterval(() => {
    duration += 1
    mainWindow.webContents.send('trial-info', JSON.stringify({ duration: String(duration) }))
  }, 1000)
}

export async function endTrial() {
  log(`Ending trial...`)

  clearInterval(countInterval)
  statusUpdate('saving')

  // Stop recording
  log(`Stopping video recording...`)
  mainWindow.webContents.send('video-control', 'stop-recording')

  running = false

  await wait(2000)

  log(`Converting data to csv...`)
  statusUpdate('cleanup')
  await convertToCSV('sensor_readings', 'jsonl')

  await wait(3000)

  log(`Trial ended, ran for ${duration} seconds`)
  updateFileDir()

  await wait(1000)

  log(`Trial ended, ran for ${duration} seconds`)
  statusUpdate('stopped')
}

const log = (m: string) => {
  logFn(m, logPrefix, true)
}
