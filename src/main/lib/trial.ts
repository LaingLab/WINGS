import { TrialInfo } from '@shared/models'
import { mainWindow } from '..'

import { connect, initBoard } from './arduino'
import { convertToCSV, updateFileDir } from './file'
import { log } from './log'
import { wait } from './utils'

let duration = 0
let countInterval

const statusUpdate = (status: string) => {
  const update = {
    status
  }
  mainWindow.webContents.send('trial-info', JSON.stringify(update))
}

const trialLog = (text: string, func?: string) => {
  log(text, `Trial${func ?? ''}`)
}

// Run trial
export async function runTrial(trialInfo: TrialInfo) {
  trialLog(`Starting trial with info ${JSON.stringify(trialInfo)}`, '.runTrial')
  updateFileDir(`${trialInfo.name}`)

  try {
    await connect(trialInfo.arduinoInfo.path, trialInfo.arduinoInfo.pins)

    await initBoard()
  } catch (error) {
    trialLog('Failed to connect to the board: skipping board initialization.', '.runTrial')
  }

  await wait(3000)

  // Start Recording
  trialLog(`Starting video recording...`, '.runTrial')
  mainWindow.webContents.send('video-control', 'start-recording')

  trialLog(`Trial started!`, '.runTrial')
  statusUpdate('started')

  countInterval = setInterval(() => {
    duration += 1
    mainWindow.webContents.send('trial-info', JSON.stringify({ duration: String(duration) }))
  }, 1000)
}

export async function endTrial() {
  trialLog(`Ending trial...`, '.endTrial')

  clearInterval(countInterval)
  statusUpdate('saving')

  trialLog(`Stopping video recording...`, '.endTrial')
  mainWindow.webContents.send('video-control', 'stop-recording')

  await wait(2000)

  trialLog(`Converting data to csv...`, '.endTrial')
  statusUpdate('cleanup')
  await convertToCSV('sensor_readings', 'jsonl')

  await wait(3000)

  trialLog(`Saving results...`, '.endTrial')

  // await saveTrialResults()

  await wait(1000)

  trialLog(`Trial ended, ran for ${duration} seconds`, '.endTrial')
  updateFileDir()

  await wait(1000)

  trialLog(`Trial ended.`, '.endTrial')
  statusUpdate('stopped')
}
