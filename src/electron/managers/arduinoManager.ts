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
    let led: five.Led;
    let beamBreak: any;

    board.on("ready", () => {
      beamBreak = new five.Switch(4);
      led = new five.Led(13);
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
