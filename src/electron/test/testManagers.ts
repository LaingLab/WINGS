import managers from "../managers.js";

const DEVICE_ADDRESS = "DB:58:B9:A7:EF:12";
const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const TOGGLE_INTERVAL_MS = 1000;

async function testInvoke() {
  console.log("testInvoke");

  managers.ioManager.getSerialDevices().then((devices) => {
    console.log("Serial devices:", devices);
  });

  await managers.bluetoothManager.startScan();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  managers.bluetoothManager.stopScan();

  let connection;

  try {
    // Connect to the device
    console.log(`Connecting to device: ${DEVICE_ADDRESS}`);
    connection = await managers.bluetoothManager.connectToDevice(
      DEVICE_ADDRESS,
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
    );

    console.log("Connected successfully!");

    // Turn the light on
    console.log("Turning light ON");
    await managers.bluetoothManager.toggleLight(connection, true);
    await new Promise((resolve) => setTimeout(resolve, TOGGLE_INTERVAL_MS));

    // Turn the light off
    console.log("Turning light OFF");
    await managers.bluetoothManager.toggleLight(connection, false);
    await new Promise((resolve) => setTimeout(resolve, TOGGLE_INTERVAL_MS));

    // Toggle 5 times
    console.log("Starting toggle sequence (5 cycles)");
    for (let i = 0; i < 5; i++) {
      // Turn on
      console.log(`Cycle ${i + 1}/5: ON`);
      await managers.bluetoothManager.toggleLight(connection, true);
      await new Promise((resolve) => setTimeout(resolve, TOGGLE_INTERVAL_MS));

      // Turn off
      console.log(`Cycle ${i + 1}/5: OFF`);
      await managers.bluetoothManager.toggleLight(connection, false);
      await new Promise((resolve) => setTimeout(resolve, TOGGLE_INTERVAL_MS));
    }

    // Try to read the current state if the characteristic supports it
    try {
      const currentValue =
        await managers.bluetoothManager.readValue(connection);
      console.log(
        `Current light state: ${currentValue[0] === 1 ? "ON" : "OFF"}`,
      );
    } catch (err) {
      console.log("Reading current state not supported by this device");
    }

    console.log("Example completed successfully");
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    // Disconnect when done
    if (connection) {
      console.log("Disconnecting...");
      await connection.disconnect();
    }

    // Exit the process after a short delay to ensure clean disconnect
    setTimeout(() => process.exit(0), 1000);
  }

  return "testInvoke";
}

testInvoke();
