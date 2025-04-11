import five from "johnny-five";

import { leds } from "./constants.js";
import { updateSensor, wait } from "./utils.js";

export async function testLights() {
  for (const key in leds) {
    toggleLed("on", leds[key]);
    await wait(200);
    toggleLed("off", leds[key]);
  }
  await wait(200);
  return 1;
}

export async function lightsOff() {
  try {
    for (const key in leds) {
      toggleLed("off", leds[key]);
    }
  } catch (e) {
    console.error(e);
    return 0;
  }
  return 1;
}

export async function toggleLed(
  state: string,
  pin: number | null,
  inputLed?: five.Led | null,
  ms?: number,
) {
  // log(`Toggling led @ pin ${pin} - ${state}`);
  let led: five.Led;

  if (pin) {
    led = new five.Led(pin);
  } else if (inputLed) {
    led = inputLed;
  } else {
    console.error("No input led");
    return null;
  }

  updateSensor(
    `led,${pin ? pin : inputLed?.pin},${state == "stop" ? "off" : state}`,
  );

  switch (state) {
    case "on":
      led.on();
      return led;
    case "off":
      led.off();
      return led;
    case "blink":
      led.blink(ms);
      return led;
    case "stop":
      led.stop().off();
      return led;
  }
}
