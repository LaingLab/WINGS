import five from "johnny-five";
import ps from "prompt-sync";

let primed = false;
let waiting = false;

let board;
let led;
let gasSensor;
let beamBreak;

const wait = async (ms) => {
  waiting = true;
  await new Promise((resolve) => setTimeout(resolve, ms));
  waiting = false;
};

function disconnect() {
  board = null;
  led = null;
  gasSensor = null;
  beamBreak = null;
}

async function prime() {
  if (!primed) {
    console.log("priming...");
    await wait(1000);
    primed = true;
    return "primed";
  } else {
    return unprime();
  }
}

async function unprime() {
  if (primed) {
    console.log("unpriming...");
    await wait(1000);
    primed = false;
    return "unprimed";
  } else {
    console.log("Already unprimed!");
    return "unprimed";
  }
}

async function connect(pathName) {
  try {
    if (board) {
      disconnect();
    }

    board = new five.Board({
      repl: false,
      port: pathName,
    });

    board.on("ready", () => {
      console.log("[connect] Board Ready!");
      initBoard();
    });

    board.on("exit", () => {
      console.log("[connect] Board disconnected.");
      led.off();
      disconnect();
    });
  } catch (e) {
    console.error(e);
  }
}

async function initBoard() {
  try {
    led = new five.Led(13);
    gasSensor = new five.Sensor({
      pin: "14",
      freq: 250,
      threshold: 5,
    });

    beamBreak = new five.Switch(4);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("[initBoard] Board initialized.");
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
      console.log("broken");
      breakCycle().then(() => {
        led.off();
      });
    } else if (!waiting && !primed) {
      console.log("unprimed... cannot break cycle.");
      waiting = true;
      wait(1000).then(() => {
        waiting = false;
      });
    }
  });
}

async function breakCycle() {
  waiting = true;

  led.blink(500);

  await wait(4250).then(() => {
    led.blink(250);
  });

  await wait(4125).then(() => {
    led.blink(125);
  });

  await wait(4125).then(() => {
    led.stop();
    led.on();
  });

  await wait(3000).then(() => {
    waiting = false;
  });

  return 1;
}

const prompt = ps({ sigint: true });

let pathName = prompt("Enter device path: ");
connect(pathName);
