import { SerialPort } from "serialport";
import five from "johnny-five";
import * as readline from "readline";

// Prompt helper using Node's readline
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// List all serial ports (connected devices)
async function getSerialDevices() {
  console.log("Device -- [get-serial-devices]");
  const ports = await SerialPort.list();
  const filteredPorts = ports.filter((port) => port.vendorId && port.productId);
  if (filteredPorts.length === 0) {
    console.log("no serial devices found");
    return [];
  }
  return filteredPorts;
}

async function main() {
  while (true) {
    // 1) Show connected devices
    const ports = await getSerialDevices();
    if (ports.length === 0) {
      console.log(
        "No serial devices found. Plug in your Arduino and try again.",
      );
      process.exit(1);
    }
    console.log("\n=== Connected Devices ===");
    ports.forEach((p, i) => console.log(` ${i + 1}: ${p.path}`));
    console.log(" -1: Quit");

    // 2) Choose device
    const devInput = await prompt("Select a device: ");
    const devIdx = parseInt(devInput, 10);
    if (devIdx === -1) {
      console.log("Goodbye!");
      process.exit(0);
    }
    if (isNaN(devIdx) || devIdx < 1 || devIdx > ports.length) {
      console.log("Invalid selection, try again.");
      continue;
    }
    const selectedPort = ports[devIdx - 1];

    // 3) Connect to board
    console.log(`\nConnecting to ${selectedPort.path}…`);
    const board = new five.Board({ port: selectedPort.path }); // auto‐detects Firmata  [oai_citation:1‡JavaScript Robotics: Board API (Johnny-Five)](https://johnny-five.io/api/board/?utm_source=chatgpt.com)
    await new Promise<void>((resolve) => board.on("ready", () => resolve()));
    console.log("✔ Board ready!");

    // 5) Pin control loop
    let disconnect = false;
    while (!disconnect) {
      const pinInput = await prompt("Select a pin to control: ");
      const pinNum = parseInt(pinInput, 10);
      if (pinNum === -1) {
        board.io.reset();
        board.io.close();
        console.log("↶ Disconnected.\n");
        disconnect = true;
        break;
      }
      if (pinNum > 13 || pinNum < 0) {
        console.log("Invalid pin, try again.");
        continue;
      }

      const led = new five.Led(pinNum);
      console.log(`\nControlling pin ${pinNum}.`);
      console.log(" 1: ON    0: OFF    -1: Back to pin list");

      // 6) On/off loop
      while (true) {
        const actionInput = await prompt("> ");
        const action = parseInt(actionInput, 10);
        if (action === -1) {
          led.stop().off();
          console.log("↶ Back to pin list.");
          break;
        }
        if (action === 1) {
          led.on();
          console.log(`✔ Pin ${pinNum} ON`);
        } else if (action === 0) {
          led.off();
          console.log(`✖ Pin ${pinNum} OFF`);
        } else {
          console.log("Invalid action, enter 1, 0, or -1.");
        }
      }
    }
    // loop back to device selection
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
