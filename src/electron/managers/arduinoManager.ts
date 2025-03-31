import five from "johnny-five";

let board: five.Board | null = null;
let waiting: boolean = false;

const wait = async (ms) => {
  waiting = true;
  await new Promise((resolve) => setTimeout(resolve, ms));
  waiting = false;
};

async function connect(path: string) {
  if (board) {
    disconnect();
  }

  try {
    board = new five.Board({
      repl: false,
      port: path,
    });
    let led: any;

    board.on("ready", () => {
      console.log("Board ready...");
      led = new five.Led(13);
      led.blink(500);
    });
    board.on("exit", () => {
      led.off();
      console.log("Board disconnected");
    });
  } catch (e) {
    return `error ${e}`;
  }
}

async function runTrial() {
  if (board) {
    const beamBreak = new five.Switch(4);
    const led = new five.Led(13);
    waiting = false;

    beamBreak.on("close", () => {
      if (!waiting) {
        console.log("broken");
        led.on();
        wait(500).then(() => {
          led.off();
        });
      }
    });
  }
}

async function disconnect() {
  board = null;
}

export default { connect, disconnect, runTrial };
