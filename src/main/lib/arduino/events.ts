import { ArduinoPin } from '@shared/models'
import { log } from '../log'
import { wait } from '../utils'
import { toggleLed, updateInfo } from './'
import { PumpController } from './controllers'

const arduinoLog = (text: string) => {
  log(text, 'Arduino-Event')
}

export async function realCycle(pins?: ArduinoPin) {
  updateInfo({ status: 'waiting' })
  await wait(1000)

  arduinoLog('Testing pump #1 (10% speed)')
  const pump1 = new PumpController(13, 12, 11)
  pump1.start(25)

  await wait(3250)

  pump1.stop()

  arduinoLog('Testing pump #2 (10% speed)')
  const pump2 = new PumpController(8, 9, 10)
  pump2.start(25)

  await wait(1250)

  pump2.stop()

  await wait(2000)
  arduinoLog('Finished Cycle!')
  return 1
}

export async function testCycle() {
  updateInfo({ status: 'waiting' })
  await wait(1000)

  const blinkled = await toggleLed({
    pin: 13,
    state: 'blink',
    freq: 250
  })

  await wait(3250)

  toggleLed({
    inputLed: blinkled,
    state: 'stop'
  })

  await wait(2000)
  arduinoLog('Finished Cycle!')
  return 1
}
