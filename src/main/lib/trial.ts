/** 
Trial Runtime
    1. Start trial called
    2. Initialize devices
    3. Start recording
    4. Event loop
    5. Save data and logs (should be automatic)
*/

import { TrialInfo } from '@shared/models'
import { connect } from './arduino'
import { convertToCSV } from './file'
import { log as logFn } from './log'
import { wait } from './utils'

const logPrefix = 'Trial'

let running = false
let duration = 0
let countInterval

// Run trial
export async function runTrial(trialInfo: TrialInfo) {
  log(`Starting trial... ${JSON.stringify(trialInfo)}`)
  running = true

  await connect()

  await wait(1000)

  // Start Recording

  log(`Trial started!`)

  countInterval = setInterval(() => (duration += 1), 1000)
}

export async function endTrial() {
  log(`Ending trial...`)

  clearInterval(countInterval)

  running = false

  await wait(1000)

  log(`Converting data to csv...`)
  await convertToCSV('sensor_readings', 'jsonl')

  await wait(1000)

  log(`Trial ended, ran for ${duration} seconds`)
}

const log = (m: string) => {
  logFn(m, logPrefix, true)
}
