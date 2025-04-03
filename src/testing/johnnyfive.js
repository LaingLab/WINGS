import five from "johnny-five";
import ps from "prompt-sync";

const prompt = ps({ sigint: true });

let waiting;

let board;
let led;
let gasSensor;
let beamBreak;

const wait = async (ms) => {
  waiting = true;
  await new Promise((resolve) => setTimeout(resolve, ms));
  waiting = false;
};

async function disconnect() {
  board = null;
}

function connect(pathName) {
  if (board) {
    disconnect();
  }

  board = new five.Board({
    repl: false,
    port: pathName,
  });

  board.on("ready", () => {
    console.log("[connect] Board Ready!");

    led = new five.Led(13);
    gasSensor = new five.Sensor({
      pin: "14",
      freq: 250,
      threshold: 5,
    });

    beamBreak = new five.Switch(4);

    let prev;
    gasSensor.on("data", (value) => {
      if (value != prev) {
        // console.log(value)
      }
      prev = value;
    });

    beamBreak.on("close", () => {
      if (!waiting) {
        console.log("broken");
        doCycle().then(() => {
          led.off();
        });
      }
    });
  });

  board.on("exit", () => {
    led.off();
  });
}

async function doCycle() {
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

let pathName = prompt("Enter device path: ");
connect(pathName);
