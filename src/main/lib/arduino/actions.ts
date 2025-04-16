import five from 'johnny-five'

export async function breakCycle() {
  waiting = true
  updateInfo({ status: 'waiting' })
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
  waiting = false

  sendLog('Finished Cycle!')
  prime()
  return 1
}

export async function testLights() {
  for (const key in leds) {
    toggleLed('on', pins[key])
    await wait(200)
    toggleLed('off', pins[key])
  }
  await wait(200)
  return 1
}

export async function lightsOff() {
  try {
    for (const key in leds) {
      const led = leds[key]
      toggleLed('off', led)
    }
    return 1
  } catch (e) {
    console.error(e)
    return 0
  }
}

export async function toggleLed(
  state: string,
  pin: number | null,
  inputLed?: five.Led,
  ms?: number
) {
  // log(`Toggling led @ pin ${pin} - ${state}`);
  let led: five.Led
  if (pin) {
    led = new five.Led(pin)
  } else {
    led = inputLed
  }

  const sensorData = {
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
      led.blink(ms)
      return led
    case 'stop':
      led.stop().off()
      return led
  }
  return 1
}
