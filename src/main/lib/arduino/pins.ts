import { Led, Pin, Sensor, Switch } from '@shared/models'
import five from 'johnny-five'
import { wait } from '../utils'
import { arduinoLog, pins } from './arduino'
import { realCycle } from './events'
import { sendEvent, updatePin } from './send'

let waiting = false

export async function initPins() {
  await wait(500)

  pins.map((pin: Pin) => {
    arduinoLog(`Initializing ${pin.type} @ pin ${pin.pin}`)
    switch (pin.type) {
      case 'led':
        ledInit(pin)
        break
      case 'sensor':
        sensorInit(pin)
        break
      case 'switch':
        switchInit(pin)
        break
      default:
        updatePin(null, {
          type: 'pin',
          active: true,
          pin: pin.pin,
          value: pin.value
        })
    }
  })

  return 1
}

function sensorInit(pin: Sensor) {
  const sensor = new five.Sensor({
    pin: pin.pin,
    freq: pin.freqency ?? 250,
    threshold: pin.threshold ?? 5
  })

  sensor.on('data', (value) => {
    if (value) {
      const sensorData: Sensor = {
        pin: pin.pin,
        type: 'sensor',
        value: String(value)
      }
      updatePin(JSON.stringify(sensorData))
    }
  })
}

function ledInit(pin: Led) {
  updatePin(null, {
    pin: pin.pin,
    type: 'led',
    value: pin.value
  })
}

function switchInit(pin: Switch) {
  const switchy = new five.Switch(pin.pin)

  switchy.on('close', async () => {
    if (!waiting && pin.active) {
      arduinoLog(`Switch closed - ${pin.pin}`)
      sendEvent({
        name: 'Switch Close',
        type: pin.pin,
        time: new Date().toLocaleTimeString()
      })
      updatePin(null, {
        pin: pin.pin,
        type: 'switch',
        value: 'closed'
      })

      waiting = true
      await realCycle()
      waiting = false

      updatePin(null, {
        pin: pin.pin,
        type: 'switch',
        value: 'open'
      })
    } else if (!waiting && !pin.active) {
      arduinoLog('Arduino is not primed, cannot activate switch.')
      waiting = true
      wait(800).then(() => {
        waiting = false
      })
    }
  })
}
