import five from 'johnny-five'

import { Pin } from '@shared/models'

import { log } from '../log'
import { wait } from '../utils'
import { updateInfo } from './'
import { initPins } from './pins'

let primed = false

let board: five.Board | null
export let pins: Pin[]

export const arduinoLog = (text: string) => {
  log(text, 'Arduino')
}

// Connection Handlers
export async function connect(pathName?, inputPins?: Pin[]) {
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
