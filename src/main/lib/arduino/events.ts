import { ArduinoPin } from '@shared/models'
import { wait } from '../utils'
import { sendLog, toggleLed, updateInfo } from './'

export async function breakCycle(pins: ArduinoPin[]) {
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

/** Test Cycle
export const testCycle = async () => {
  const yellowLedBlink = await toggleLed('blink', pins.yellowLed, 250)
  await toggleLed('off', pins.greenLed)

  await wait(1000)

  sendLog('Atomizer On...')
  toggleLed('on', pins.atomizer)

  await wait(4000)

  sendLog('Atomizer Off.')
  toggleLed('off', pins.atomizer)

  sendLog('Pumping vapor into chamber...')
  toggleLed('on', pins.inflowPump)

  await wait(3000)

  sendLog('Letting vapor dissipate...')
  const inflowPumpBlink = await toggleLed('blink', pins.inflowPump, 250)

  await wait(6000)

  await toggleLed('stop', null, inflowPumpBlink)

  sendLog('Pumping out excess vapor...')
  toggleLed('on', pins.outflowPump)

  await wait(5000)

  sendLog('Vapor levels sufficently low. Stopping in 3...')
  const outflowPumpBlink = await toggleLed('blink', pins.outflowPump, 250)

  await wait(4000)

  sendLog('Pump stopped.')
  await toggleLed('stop', null, outflowPumpBlink)

  await wait(2000)

  await toggleLed('stop', null, yellowLedBlink)
}
*/
