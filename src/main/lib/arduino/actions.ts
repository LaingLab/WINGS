import { ArduinoLed, ArduinoPump } from '@shared/models'
import five from 'johnny-five'
import { log } from '../log'
import { updatePin } from './'
import { PumpController } from './controllers'

const arduinoLog = (text: string) => {
  log(text, 'Arduino-Action')
}

export async function togglePump({ pins, state, speed }: ArduinoPump) {
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

export async function toggleLed({ state, pin, freq, inputLed, noLog }: ArduinoLed) {
  noLog ?? arduinoLog(`Toggling led @ pin ${pin ?? inputLed?.pin} - ${state}`)

  if (!pin && !inputLed) {
    arduinoLog('<ERROR> Recieved no pin')
  }

  if ((Number(pin) < 0 || Number(pin) > 18) && !inputLed) {
    arduinoLog('<ERROR> Pin invalid')
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
