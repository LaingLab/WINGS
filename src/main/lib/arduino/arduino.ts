import five from 'johnny-five'

import { ArduinoPin } from '@shared/models'
import { wait } from '../utils'
import { realCycle, sendEvent, sendLog, toggleLed, updateInfo, updatePin } from './'

let primed = false
let waiting = false

let board: five.Board | null
let pins: ArduinoPin[]

export async function connect(pathName?, inputPins?: ArduinoPin[]) {
  sendLog(`Connect function called`)

  await wait(500)

  if (board) {
    sendLog('Removing all connected devices...')
    disconnect({ noLog: true })
  }

  await wait(500)

  sendLog('Connecting to board...')
  board = new five.Board({
    repl: false,
    port: pathName
  })
  pins = inputPins ?? []

  // wait here until the board truly fires 'ready'
  await new Promise<void>((resolve) => {
    board?.on('ready', () => {
      sendLog(`Board connected @ ${board?.port}`)
      updateInfo({ status: 'connected', path: board?.port })
      resolve()
    })
  })

  board.on('exit', () => {
    disconnect()
  })
}

export async function initBoard() {
  await wait(500)

  sendLog('Initializing board...')

  if (!board) {
    console.log('No board found')
    sendLog('Board not found.')
    return 1
  }

  await initPins()

  await wait(1000)

  await prime(false)

  await wait(800)

  sendLog('Board initialized')

  await wait(2000)

  sendLog(`Board ready`)

  return 1
}

async function initPins() {
  await wait(500)

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
          await realCycle()
          waiting = false

          updatePin(null, {
            id: `switch-${pin.pin}`,
            pin: pin.pin,
            type: 'switch',
            value: 'open',
            options: { ...pin.options }
          })

          prime(false)
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

export async function prime(prime = true) {
  if (!primed && prime) {
    sendLog('Priming...')
    await wait(500)

    toggleLed({ pin: 13, state: 'on', noLog: true })
    updateInfo({ primed: true })
    primed = true
    return 'primed'
  } else {
    sendLog('Unpriming...')
    await wait(500)

    toggleLed({ pin: 13, state: 'off', noLog: true })
    updateInfo({ primed: false })
    primed = false
    return 'unprimed'
  }
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
