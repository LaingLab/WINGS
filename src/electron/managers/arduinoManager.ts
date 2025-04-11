// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import five from "johnny-five";
import { mainWindow } from "../main.js";

let primed = false;
let waiting = false;
let board: five.Board;

const pins: Record<string, number> = {
  beamBreak: 3,
  atomizer: 4,
  inflowPump: 5,
  outflowPump: 6,
  blueLed: 13,
  yellowLed: 10,
  greenLed: 11,
  redLed: 12,
  gasSensor: 14,
};

const sensors: Record<string, five.Sensor | null> = {
  beamBreak: null,
  gasSensor: null,
};

const leds: Record<string, five.Led | null> = {
  atomizer: null,
  inflowPump: null,
  outflowPump: null,
  yellowLed: null,
  greenLed: null,
  redLed: null,
  blueLed: null,
};

async function connect(pathName = null) {
  log(`Connect function called`);

  try {
    if (board) {
      log("Removing all connected devices...");
      disconnect({ noLog: true });
    }

    log("Connecting to board...");
    board = await new five.Board({
      repl: false,
      port: pathName,
    });

    board.on("ready", () => {
      log(`Board ready`);
      initBoard().then(() => update("connected"));
      log(`Board connected @ ${board.port}`);
    });

    board.on("exit", () => {
      disconnect();
    });
  } catch (e) {
    console.error(e);
  }
}

async function initBoard() {
  log("Initializing board...");
  try {
    sensors.beamBreak = new five.Switch(3);
    sensors.gasSensor = new five.Sensor({
      pin: 14,
      freq: 250,
      threshold: 5,
    });

    for (const key in leds) {
      const pin = pins[key];
      leds[key] = new five.Led(pin);
    }

    unprime();
  } catch (e) {
    console.error(e);
  } finally {
    log("Board initialized");

    await eventListeners();
  }
  return 1;
}

async function eventListeners() {
  log("Initializing event listeners...");
  try {
    let prev;
    sensors.gasSensor.on("data", (value) => {
      if (value != prev) {
        // console.log(value)
      }
      prev = value;
    });

    sensors.beamBreak.on("close", () => {
      if (!waiting && primed) {
        log("Broken");
        breakCycle();
      } else if (!waiting && !primed) {
        log("Unprimed... cannot break cycle.");
        waiting = true;
        wait(1000).then(() => {
          waiting = false;
        });
      }
    });
  } catch (e) {
    console.error(e);
  } finally {
    log("Event listeners initialized");
    toggleLed("on", pins.redLed);
  }
  return 1;
}

async function testLights() {
  for (const key in leds) {
    toggleLed("on", pins[key]);
    await wait(500);
    toggleLed("off", pins[key]);
  }
  await wait(500);
  return 1;
}

async function toggleLed(
  state: string,
  pin: number | null,
  inputLed?: five.Led,
  ms?: number,
) {
  log(`Toggling led @ pin ${pin} - ${state}`);
  let led: five.Led;
  if (pin) {
    led = new five.Led(pin);
  } else {
    led = inputLed;
  }

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
  return 1;
}

async function breakCycle() {
  waiting = true;
  update("waiting");
  const yellowLedBlink = await toggleLed("blink", pins.yellowLed, 250);
  await toggleLed("off", pins.greenLed);

  await wait(1000);

  log("Atomizer On...");
  toggleLed("on", pins.atomizer);

  await wait(4000);

  log("Atomizer Off.");
  toggleLed("off", pins.atomizer);

  log("Pumping vapor into chamber...");
  toggleLed("on", pins.inflowPump);

  await wait(3000);

  log("Letting vapor dissipate...");
  const inflowPumpBlink = await toggleLed("blink", pins.inflowPump, 250);

  await wait(6000);

  await toggleLed("stop", null, inflowPumpBlink);

  log("Pumping out excess vapor...");
  toggleLed("on", pins.outflowPump);

  await wait(5000);

  log("Vapor levels sufficently low. Stopping in 3...");
  const outflowPumpBlink = await toggleLed("blink", pins.outflowPump, 250);

  await wait(4000);

  log("Pump stopped.");
  await toggleLed("stop", null, outflowPumpBlink);

  await wait(2000);

  await toggleLed("stop", null, yellowLedBlink);
  waiting = false;

  log("Finished Cycle!");
  prime();
  return 1;
}

async function disconnect(params?: { noLog: boolean }) {
  await lightsOff().then(() => {
    primed = false;
    waiting = false;

    board = null;
    for (const key in sensors) {
      sensors[key] = null;
    }

    for (const key in leds) {
      leds[key] = null;
    }

    if (!params?.noLog) {
      log("Disconnected");
      update("disconnected");
    }
  });
}

async function lightsOff() {
  try {
    for (const key in leds) {
      const led = leds[key];
      led.off();
    }
  } catch (e) {
    console.error(e);
    return 0;
  }
}

async function prime() {
  log("Priming...");
  await wait(1000);
  primed = true;
  toggleLed("off", pins.redLed);
  toggleLed("on", pins.greenLed);
  update("primed");
  return "primed";
}

async function unprime() {
  log("Unpriming...");
  await wait(1000);
  primed = false;
  toggleLed("off", pins.greenLed);
  toggleLed("on", pins.redLed);
  update("unprimed");
  return "unprimed";
}

const wait = async (ms) => {
  waiting = true;
  await new Promise((resolve) => setTimeout(resolve, ms));
  waiting = false;
};

const log = (message: string) => {
  console.log(`[Arduino] <LOG> ${message}`);
  mainWindow.webContents.send("arduino-log", `${message}`);
};

const update = (data: string) => {
  console.log(`[Arduino] <UPDATE> ${data}`);
  mainWindow.webContents.send("arduino-update", data);
};

export default { connect, disconnect, prime, unprime, testLights, toggleLed };
