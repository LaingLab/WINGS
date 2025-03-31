import five from "johnny-five";

let board: five.Board | null = null;

async function connect(path: string) {
  if (board) {
    disconnect();
  }

  board = new five.Board({
    repl: false,
    port: path,
  });

  board.on("ready", () => {
    const led = new five.Led(13);
    led.blink(500);
    console.log("Board connected");

    board.on("exit", () => {
      led.stop();
      console.log("Board disconnected");
    });
  });
}

async function disconnect() {
  board.close();
  five.Board.purge();
  board = null;
}

export default { connect, disconnect };
