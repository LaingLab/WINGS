import five from 'johnny-five'
import { sendLog, updatePin } from './'

type ToggleLed = {
  state: string
  pin?: number
  freq?: number
  inputLed?: five.Led
}

type ArduinoPump = {
  id?: string
  speed?: number
  state?: string
  pins: [number, number, number]
}

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

export async function toggleLed({ state, pin, freq, inputLed }: ToggleLed) {
  sendLog(`Toggling led @ pin ${pin ?? inputLed?.pin} - ${state}`)

  if (!pin && !inputLed) {
    sendLog('<ERROR> Recieved no pin')
  }

  if ((Number(pin) < 0 || Number(pin) > 18) && !inputLed) {
    sendLog('<ERROR> Pin invalid')
  }

  const led: five.Led = inputLed ?? new five.Led(Number(pin))

  const sensorData = {
    id: `led-${pin ?? inputLed?.pin}`,
    pin: pin ? pin : inputLed?.pin,
    type: 'led',
    value: state == 'stop' ? 'off' : state
  }
  updatePin(JSON.stringify(sensorData))

  switch (state) {
    case 'on':
      led.on()
      return led
    case 'off':
      led.off()
      return led
    case 'blink':
      led.blink(freq)
      return led
    case 'stop':
      led.stop().off()
      return led
  }
  return led
}

export async function togglePump({ pins, state, speed }: ArduinoPump) {
  // const ena = new five.Pin(Number(enaPin))
  // const int1 = new five.Pin(Number(enaPin + 1))
  // const int2 = new five.Pin(Number(enaPin + 2))

  const pump = new PumpController(pins[0], pins[1], pins[2])

  switch (state) {
    case 'on':
      pump.start(speed)
      break
    case 'off':
      pump.stop()
      break
    case 'reverse':
      pump.reverse(speed)
      break
  }
}
