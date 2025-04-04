import five from "johnny-five";
import { mainWindow } from "../main.js";

const BEAM_BREAK_PIN = 4;
const GAS_SENSOR_PIN = 14;

const ATOMIZER_PIN = 7;
const PUMP_IN_PIN = 10;
const PUMP_OUT_PIN = 12;

const BLUE_LED_PIN = 13;

const YELLOW_LED_PIN = 2;
const GREEN_LED_PIN = 5;
const RED_LED_PIN = 8;

let primed = false;
let waiting = false;

let board;
let beamBreak;
let gasSensor;

let atomizer: five.Led;
let pumpIn: five.Led;
let pumpOut: five.Led;

let blueLed: five.Led;
let yellowLed: five.Led;
let greenLed: five.Led;
let redLed: five.Led;

async function initBoard() {
  try {
    beamBreak = new five.Switch(BEAM_BREAK_PIN);
    gasSensor = new five.Sensor({
      pin: GAS_SENSOR_PIN,
      freq: 250,
      threshold: 5,
    });

    atomizer = new five.Led(ATOMIZER_PIN);
    pumpIn = new five.Led(PUMP_IN_PIN);
    pumpOut = new five.Led(PUMP_OUT_PIN);

    blueLed = new five.Led(BLUE_LED_PIN);
    yellowLed = new five.Led(YELLOW_LED_PIN);
    greenLed = new five.Led(GREEN_LED_PIN);
    redLed = new five.Led(RED_LED_PIN);
  } catch (e) {
    console.error(e);
  } finally {
    log("Board initialized.");
    update("connected");
    blueLed.on();
    redLed.on();
    eventListeners();
  }
}

async function eventListeners() {
  let prev;
  gasSensor.on("data", (value) => {
    if (value != prev) {
      // console.log(value)
    }
    prev = value;
  });

  beamBreak.on("close", () => {
    if (!waiting && primed) {
      log("Broken");
      breakCycle().then(() => {
        pumpOut.off();
      });
    } else if (!waiting && !primed) {
      log("Unprimed... cannot break cycle.");
      waiting = true;
      wait(1000).then(() => {
        waiting = false;
      });
    }
  });
}

async function breakCycle() {
  waiting = true;
  update("waiting");
  yellowLed.on();
  yellowLed.blink(250);
  greenLed.off();

  log("Atomizer On...");
  atomizer.on();

  await wait(2000);

  log("Atomizer Off.");
  atomizer.off();

  await wait(800);

  log("Pumping vapor into chamber...");
  pumpIn.on();

  await wait(3000);

  log("Letting vapor dissipate...");
  pumpIn.blink(250);

  await wait(6000);

  pumpIn.stop();
  pumpIn.off();

  log("Pumping out excess vapor...");
  pumpOut.on();

  await wait(5000);

  log("Vapor levels sufficently low. Stopping in 3...");
  pumpOut.blink(250);

  await wait(4000);

  log("Pump stopped.");
  pumpOut.stop();
  pumpOut.off();

  await wait(250);

  log("Finished Cycle!");
  waiting = false;
  update("primed");
  yellowLed.stop();
  yellowLed.off();
  greenLed.on();

  return 1;
}

async function connect(pathName = null) {
  try {
    if (board) {
      disconnect();
    }

    board = new five.Board({
      repl: false,
      port: pathName,
    });

    board.on("ready", () => {
      log("Board Ready!");
      update("initializing");
      initBoard();
    });

    board.on("exit", () => {
      log("Board disconnected.");
      disconnect();
    });
  } catch (e) {
    console.error(e);
  }
}

async function disconnect() {
  await lightsOff().then(() => {
    primed = false;
    waiting = false;

    board = null;
    beamBreak = null;
    gasSensor = null;

    atomizer = null;
    pumpIn = null;
    pumpOut = null;

    blueLed = null;
    yellowLed = null;
    greenLed = null;
    redLed = null;

    log("Disconnected");
    update("disconnected");
  });
}

async function lightsOff() {
  try {
    atomizer.off();
    pumpIn.off();
    pumpOut.off();

    blueLed.off();
    yellowLed.off();
    greenLed.off();
    redLed.off();
  } catch (e) {
    console.error(e);
    return 0;
  }
}

async function prime() {
  if (!primed) {
    log("Priming...");
    await wait(1000);
    primed = true;
    redLed.off();
    greenLed.on();
    update("primed");
    return "primed";
  } else {
    return unprime();
  }
}

async function unprime() {
  if (primed) {
    log("Unpriming...");
    await wait(1000);
    primed = false;
    greenLed.off();
    redLed.on();
    update("unprimed");
    return "unprimed";
  } else {
    log("Already unprimed!");
    return "unprimed";
  }
}

const wait = async (ms) => {
  waiting = true;
  await new Promise((resolve) => setTimeout(resolve, ms));
  waiting = false;
};

const log = (message: string) => {
  console.log(`[Arduino] <LOG> ${message}`);
  mainWindow.webContents.send("arduino-log", `[Arduino] ${message}`);
};

const update = (data: string) => {
  console.log(`[Arduino] <UPDATE> ${data}`);
  mainWindow.webContents.send("arduino-update", data);
};

export default { connect, disconnect, prime, unprime };
