import five from 'johnny-five'

import { ArduinoPin } from '@shared/models'
import { mainWindow } from '..'
import { lightsOff } from './arduino/'
import { saveEvent, saveSensorReading, saveTxtLog } from './file'
import { wait } from './utils'

let primed = false
let waiting = false

let board: five.Board | null
let pins: ArduinoPin[] = []

export async function connect(pathName = null, inputPins: ArduinoPin[]) {
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
    pins = inputPins

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
    pins.map((pin: ArduinoPin) => {
      if (pin.type === 'sensor') {
        const sensor = new five.Sensor({
          pin: pin.pin,
          freq: pin.options?.freq ?? 250,
          threshold: pin.options?.threshold ?? 5
        })

        sensor.on('data', (value) => {
          if (value) {
            const sensorData: ArduinoPin = {
              id: pin.id,
              pin: pin.pin,
              type: 'sensor',
              value: String(value),
              options: { ...pin.options }
            }
            updatePin(JSON.stringify(sensorData))
          }
        })
      }

      if (pin.type === 'switch') {
        beamBreak.on('close', () => {
          if (!waiting && primed) {
            sendLog('Broken')
            sendEvent({
              name: 'Beam Broken',
              type: 'beam-break',
              time: new Date().toLocaleTimeString()
            })
            breakCycle()
          } else if (!waiting && !primed) {
            sendLog('Unprimed... cannot break cycle.')
            waiting = true
            wait(1000).then(() => {
              waiting = false
            })
          }
        })
      }
    })

    unprime()
  } catch (e) {
    console.error(e)
  } finally {
    sendLog('Board initialized')
    await eventListeners()
  }
  return 1
}

async function disconnect(params?: { noLog: boolean }) {
  await lightsOff().then(async () => {
    primed = false
    waiting = false

    board = null
    pins = []

    if (!params?.noLog) {
      sendLog('Disconnected')
      updateInfo({ status: 'disconnected' })
    }
  })
}

async function eventListeners() {
  sendLog('Initializing event listeners...')
  // await testLights()

  try {
    let prev
  } catch (e) {
    console.error(e)
  } finally {
    sendLog('Event listeners initialized')
    toggleLed('on', pins.redLed)
  }
  return 1
}

export async function prime() {
  if (!primed) {
    sendLog('Priming...')
    await wait(1000)
    primed = true
    updateInfo({ primed: true })
    toggleLed('off', pins.redLed)
    toggleLed('on', pins.greenLed)
    return 'primed'
  } else {
    unprime()
  }
}

async function unprime() {
  sendLog('Unpriming...')
  await wait(1000)
  primed = false
  toggleLed('off', pins.greenLed)
  toggleLed('on', pins.redLed)
  updateInfo({ primed: false })
  return 'unprimed'
}

const sendLog = (message: string) => {
  console.log(`[Arduino] <LOG> ${message}`)
  mainWindow.webContents.send('trial-log', `${message}`)
  saveTxtLog(`[Arduino] ${message}`)
}

const updateInfo = (data) => {
  console.log(`[Arduino] <INFO> ${JSON.stringify(data)}`)
  mainWindow.webContents.send('arduino-info', JSON.stringify(data))
}

const updatePin = (data: string) => {
  // console.log(`[Arduino] <PIN> ${data}`)
  mainWindow.webContents.send('arduino-pin', data)
  saveSensorReading(JSON.parse(data))
}

const sendEvent = (data) => {
  console.log(`[Arduino] <EVENT> ${JSON.stringify(data)}`)
  mainWindow.webContents.send('arduino-event', JSON.stringify(data))
  saveEvent(data)
}
