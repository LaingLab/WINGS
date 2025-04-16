import five from 'johnny-five'

import { ArduinoPin } from '@shared/models'
import { wait } from '../utils'
import { breakCycle, sendEvent, sendLog, toggleLed, updateInfo, updatePin } from './'

let primed = false
let waiting = false

let board: five.Board | null
let pins: ArduinoPin[]

export async function connect(pathName?, inputPins?: ArduinoPin[]) {
  sendLog(`Connect function called`)

  try {
    if (board) {
      sendLog('Removing all connected devices...')
      disconnect({ noLog: true })
    }

    sendLog('Connecting to board...')
    board = await new five.Board({
      repl: false,
      port: pathName
    })
    pins = inputPins ?? []

    board.on('ready', () => {
      sendLog(`Board ready`)
      initBoard().then(() => updateInfo({ status: 'connected', path: board?.port }))
      sendLog(`Board connected @ ${board?.port}`)
    })

    board.on('exit', () => {
      disconnect()
    })
  } catch (e) {
    console.error(e)
  }
}

async function initBoard() {
  sendLog('Initializing board...')

  try {
    await initPins()

    unprime()
  } catch (e) {
    console.error(e)
  } finally {
    sendLog('Board initialized')
  }
  return 1
}

async function initPins() {
  pins.map((pin: ArduinoPin) => {
    sendLog(`Initializing ${pin.type} @ pin ${pin.pin}`)
    if (pin.type == 'sensor') {
      const sensor = new five.Sensor({
        pin: pin.pin,
        freq: pin.options?.freq ?? 250,
        threshold: pin.options?.threshold ?? 5
      })

      sensor.on('data', (value) => {
        if (value) {
          const sensorData: ArduinoPin = {
            id: `sensor-${pin.pin}`,
            pin: pin.pin,
            type: 'sensor',
            value: String(value),
            options: { ...pin.options }
          }
          updatePin(JSON.stringify(sensorData))
        }
      })
    }
    if (pin.type == 'switch') {
      const switchy = new five.Switch(pin.pin)

      switchy.on('close', async () => {
        if (!waiting && primed) {
          sendLog(`Switch closed - ${pin.id}`)
          sendEvent({
            name: 'Switch Close',
            type: pin.id,
            time: new Date().toLocaleTimeString()
          })
          updatePin(null, {
            id: `switch-${pin.pin}`,
            pin: pin.pin,
            type: 'switch',
            value: 'closed',
            options: { ...pin.options }
          })

          waiting = true
          await breakCycle(pins)
          waiting = false
          updatePin(null, {
            id: `switch-${pin.pin}`,
            pin: pin.pin,
            type: 'switch',
            value: 'open',
            options: { ...pin.options }
          })
          unprime()
        } else if (!waiting && !primed) {
          sendLog('Arduino is not primed, cannot activate switch.')
          waiting = true
          wait(800).then(() => {
            waiting = false
          })
        }
      })
    }
    if (pin.type == 'led') {
      updatePin(null, {
        id: `led-${pin.pin}`,
        pin: pin.pin,
        type: 'led',
        value: pin.value,
        options: { ...pin.options }
      })
    }
  })

  return 1
}

async function disconnect(params?: { noLog: boolean }) {
  primed = false
  waiting = false

  board = null
  pins = []

  if (!params?.noLog) {
    sendLog('Disconnected')
    updateInfo({ status: 'disconnected' })
  }
}

export async function prime() {
  if (!primed) {
    sendLog('Priming...')
    await wait(1000)
    toggleLed({ pin: 13, state: 'on' })
    primed = true
    updateInfo({ primed: true })
    return 'primed'
  } else {
    return unprime()
  }
}

async function unprime() {
  sendLog('Unpriming...')
  await wait(1000)
  toggleLed({ pin: 13, state: 'off' })
  primed = false
  updateInfo({ primed: false })
  return 'unprimed'
}
