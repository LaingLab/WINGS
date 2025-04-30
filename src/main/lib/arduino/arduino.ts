import five from 'johnny-five'

import { ArduinoPin } from '@shared/models'

import { log } from '../log'
import { wait } from '../utils'
import { realCycle, sendEvent, updateInfo, updatePin } from './'

let primed = false
let waiting = false

let board: five.Board | null
let pins: ArduinoPin[]

const arduinoLog = (text: string) => {
  log(text, 'Arduino')
}

// Connection Handlers
export async function connect(pathName?, inputPins?: ArduinoPin[]) {
  arduinoLog(`Connect function called`)

  await wait(500)

  if (board) {
    arduinoLog('Removing all connected devices...')
    disconnect({ noLog: true })
  }

  await wait(500)

  arduinoLog('Connecting to board...')
  board = new five.Board({
    repl: false,
    port: pathName
  })
  pins = inputPins ?? []

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      arduinoLog('Could not connect to board within 15 seconds.')
      updateInfo({ status: 'error', message: 'Connection timeout' })
      reject(new Error('Timeout connecting to board'))
    }, 10000)
    board?.on('ready', () => {
      clearTimeout(timeout)
      arduinoLog(`Board connected @ ${board?.port}`)
      updateInfo({ status: 'connected', path: board?.port })
      resolve()
    })
  })

  board.on('exit', () => {
    disconnect()
  })
}

async function disconnect(params?: { noLog: boolean }) {
  primed = false
  waiting = false

  board = null
  pins = []

  if (!params?.noLog) {
    arduinoLog('Disconnected')
    updateInfo({ status: 'disconnected' })
  }
}

// Initialization Steps
export async function initBoard() {
  await wait(500)

  arduinoLog('Initializing board...')

  if (!board) {
    console.log('No board found')
    arduinoLog('Board not found.')
    return 1
  }

  await initPins()

  await wait(1000)

  arduinoLog('Board initialized')

  await wait(1500)

  arduinoLog(`Board ready`)

  return 1
}

async function initPins() {
  await wait(500)

  pins.map((pin: ArduinoPin) => {
    arduinoLog(`Initializing ${pin.type} @ pin ${pin.pin}`)
    if (pin.type == 'sensor') {
      const sensor = new five.Sensor({
        pin: pin.pin,
        freq: pin.opts?.frequency ?? 250,
        threshold: pin.opts?.threshold ?? 5
      })

      sensor.on('data', (value) => {
        if (value) {
          const sensorData: ArduinoPin = {
            pin: pin.pin,
            type: 'sensor',
            value: String(value),
            opts: { ...pin.opts }
          }
          updatePin(JSON.stringify(sensorData))
        }
      })
    }
    if (pin.type == 'switch') {
      const switchy = new five.Switch(pin.pin)

      switchy.on('close', async () => {
        if (!waiting && primed) {
          arduinoLog(`Switch closed - ${pin.pin}`)
          sendEvent({
            name: 'Switch Close',
            type: pin.pin,
            time: new Date().toLocaleTimeString()
          })
          updatePin(null, {
            pin: pin.pin,
            type: 'switch',
            value: 'closed',
            opts: { ...pin.opts }
          })

          waiting = true
          await realCycle()
          waiting = false

          updatePin(null, {
            pin: pin.pin,
            type: 'switch',
            value: 'open',
            opts: { ...pin.opts }
          })

          prime(false)
        } else if (!waiting && !primed) {
          arduinoLog('Arduino is not primed, cannot activate switch.')
          waiting = true
          wait(800).then(() => {
            waiting = false
          })
        }
      })
    }
    if (pin.type == 'led') {
      updatePin(null, {
        pin: pin.pin,
        type: 'led',
        value: pin.value,
        opts: { ...pin.opts }
      })
    }
  })

  return 1
}

// Actions
export async function prime(prime = true) {
  if (!primed && prime) {
    arduinoLog('Priming...')
    await wait(500)

    updateInfo({ primed: true })
    primed = true
    return 'primed'
  } else {
    arduinoLog('Unpriming...')
    await wait(500)

    updateInfo({ primed: false })
    primed = false
    return 'unprimed'
  }
}
