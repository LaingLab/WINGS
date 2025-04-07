import five from "johnny-five";

let primed = false;
let waiting = false;
let board;

const pins = {
  beamBreak: 2,
  atomizer: 3,
  inflowPump: 5,
  outflowPump: 6,
  yellowLed: 10,
  greenLed: 11,
  redLed: 12,
  blueLed: 13,
  gasSensor: 14,
};

const sensors = {
  beamBreak: null,
  gasSensor: null,
};

// const leds = {
//   atomizer: null,
//   inflowPump: null,
//   outflowPump: null,
//   yellowLed: null,
//   greenLed: null,
//   redLed: null,
//   blueLed: null,
// };

let leds;

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
    sensors.beamBreak = new five.Switch(2);
    sensors.gasSensor = new five.Sensor({
      pin: 14,
      freq: 250,
      threshold: 5,
    });

    leds = {
      atomizer: new five.Led(3),
      inflowPump: new five.Led(5),
      outflowPump: new five.Led(6),
      yellowLed: new five.Led(10),
      greenLed: new five.Led(11),
      redLed: new five.Led(12),
      blueLed: new five.Led(13),
    };
  } catch (e) {
    console.error(e);
  } finally {
    log("Board initialized");
    await testLights();
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
  }
  log("Event listeners initialized");
  return 1;
}

async function testLights() {
  log("Testing Lights...");
  for (const key in leds) {
    if (await testLight(leds[key])) {
      continue;
    }
  }
  await wait(500);
  return 1;
}

async function testLight(led) {
  log(`Testing led`);
  led.on();
  await wait(500);
  led.off();
  return true;
}

async function disconnect(params) {
  await lightsOff().then(() => {
    primed = false;
    waiting = false;

    board = null;
    leds = null;
    // for (const key in sensors) {
    //   sensors[key] = null;
    // }

    // for (const key in leds) {
    //   leds[key] = null;
    // }

    if (!params?.noLog) {
      log("Disconnected");
      update("disconnected");
    }
  });
}

const wait = async (ms) => {
  waiting = true;
  await new Promise((resolve) => setTimeout(resolve, ms));
  waiting = false;
};

const log = (message) => {
  console.log(`[Arduino] <LOG> ${message}`);
};

const update = (data) => {
  console.log(`[Arduino] <UPDATE> ${data}`);
};

connect();
