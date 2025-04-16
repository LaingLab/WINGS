import five from 'johnny-five'
import { sendLog, updatePin } from './'

type ToggleLed = {
  state: string
  pin?: number
  freq?: number
  inputLed?: five.Led
}

export async function toggleLed({ state, pin, freq, inputLed }: ToggleLed) {
  sendLog(`Toggling led @ pin ${pin} - ${state}`)

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
