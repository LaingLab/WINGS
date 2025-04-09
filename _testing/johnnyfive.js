import five from "johnny-five";
import keypress from "keypress";

keypress(process.stdin);

let board = new five.Board();

board.on("ready", () => {
  let led = new five.Led(13);
  let led1 = new five.Led(4);
  let led2 = new five.Led(5);
  let led3 = new five.Led(6);

  process.stdin.resume();
  process.stdin.setEncoding("utf-8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (ch, key) => {
    if (!key) return;

    if (key.name === "w") {
      blinkLight(led);
    } else if (key.name === "a") {
      blinkLight(led1);
    } else if (key.name === "s") {
      blinkLight(led2);
    } else if (key.name === "d") {
      blinkLight(led3);
    }
  });
  console.log("ready");
});

async function blinkLight(led) {
  led.on();
  await new Promise((r) => setTimeout(r, 100));
  led.off();
}
