import five from "johnny-five";

import { wait, log, update, updateSensor } from "./utils.js";
import { lightsOff, testLights, toggleLed } from "./led.js";
import { leds } from "./constants.js";

let primed = false;
let waiting = false;

let board: five.Board | null;

async function connect(pathName?) {
  log(`Connect function called`);

  try {
    if (board) {
      log("Removing all connected devices...");
      disconnect("nolog");
    }

    log("Connecting to board...");
    board = await new five.Board({
      repl: false,
      port: pathName,
    });

    board.on("ready", () => {
      log(`Board connected @ ${board?.port}`);
      update("connected");
      init();
    });

    board.on("exit", () => {
      disconnect();
    });
  } catch (e) {
    console.error(e);
  }
}

async function disconnect(params?: string) {
  await lightsOff().then(() => {
    primed = false;
    waiting = false;

    board = null;

    if (params != "nolog") {
      log("Disconnected");
      update("disconnected");
    }
  });
}

async function init() {
  log("Initializing board...");
  try {
    log("Initialzing Leds...");
    await testLights();

    log("Initialzing Sensors...");
    const beamBreak = new five.Switch(3);
    const gasSensor = new five.Sensor({
      pin: 14,
      freq: 250,
      threshold: 5,
    });

    let prev;
    gasSensor.on("data", (value) => {
      if (value != prev) {
        updateSensor(`gas,${value}`);
      }
      prev = value;
    });

    beamBreak.on("close", () => {
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
    await unprime();
    log("Board initialized");
  }
  return 1;
}

async function breakCycle() {
  waiting = true;
  update("waiting");
  const yellowLedBlink = await toggleLed("blink", leds.yellowLed, null, 250);
  await toggleLed("off", leds.greenLed);

  await wait(1000);

  log("Atomizer On...");
  toggleLed("on", leds.atomizer);

  await wait(4000);

  log("Atomizer Off.");
  toggleLed("off", leds.atomizer);

  log("Pumping vapor into chamber...");
  toggleLed("on", leds.inflowPump);

  await wait(3000);

  log("Letting vapor dissipate...");
  const inflowPumpBlink = await toggleLed("blink", leds.inflowPump, null, 250);

  await wait(6000);

  await toggleLed("stop", null, inflowPumpBlink);

  log("Pumping out excess vapor...");
  toggleLed("on", leds.outflowPump);

  await wait(5000);

  log("Vapor levels sufficently low. Stopping in 3...");
  const outflowPumpBlink = await toggleLed(
    "blink",
    leds.outflowPump,
    null,
    250,
  );

  await wait(4000);

  log("Pump stopped.");
  await toggleLed("stop", null, outflowPumpBlink);

  await wait(2000);

  await toggleLed("stop", null, yellowLedBlink);
  waiting = false;

  log("Finished Cycle!");
  update("connected");
  prime();
  return 1;
}

// async function send() {}

async function prime() {
  log("Priming...");
  await wait(1000);
  primed = true;
  await toggleLed("off", leds.redLed);
  await toggleLed("on", leds.greenLed);
  update("primed");
  return "primed";
}

async function unprime() {
  log("Unpriming...");
  await wait(1000);
  primed = false;
  await toggleLed("off", leds.greenLed);
  await toggleLed("on", leds.redLed);
  update("unprimed");
  return "unprimed";
}

export default {
  connect,
  disconnect,
  prime,
  unprime,
  testLights,
  toggleLed,
};

/**
 * connect
 * initalize
 * input
 * disconnect
 * cleanup
 */
