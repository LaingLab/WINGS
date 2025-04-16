import { ArduinoPin } from '@shared/models'
import five from 'johnny-five'
import { wait } from '../utils'
import { sendLog, toggleLed, updateInfo } from './'

class PumpController {
  ena: five.Pin
  int1: five.Pin
  int2: five.Pin

  constructor(enaPin, int1Pin, int2Pin) {
    this.ena = new five.Pin({ pin: enaPin })
    this.int1 = new five.Pin({ pin: int1Pin })
    this.int2 = new five.Pin({ pin: int2Pin })
  }

  start(speed) {
    this.int1.high()
    this.int2.low()
    this.ena.write(speed ?? 25) // 0-255
  }

  stop() {
    this.ena.write(0)
    this.int1.low()
    this.int2.low()
  }

  reverse(speed = 255) {
    this.int1.low()
    this.int2.high()
    this.ena.write(speed)
  }
}

export async function realCycle(pins?: ArduinoPin) {
  updateInfo({ status: 'waiting' })
  await wait(1000)

  sendLog('Testing pump #1 (10% speed)')
  const pump1 = new PumpController(11, 12, 13)
  pump1.start(25)

  await wait(3250)

  pump1.stop()

  sendLog('Testing pump #2 (10% speed)')
  const pump2 = new PumpController(8, 9, 10)
  pump2.start(25)

  await wait(1250)

  pump2.stop()

  await wait(2000)
  sendLog('Finished Cycle!')
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
  sendLog('Finished Cycle!')
  return 1
}
