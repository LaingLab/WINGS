// @ts-nocheck
import noble, { Peripheral } from "@abandonware/noble";
import { log, fnLog, error, success } from "../utils/logger.js";

let isScanning = false;
let isInitialized = false;
let hasListeners = false;
let isSearchingForDevice = false;

let lastCommandTime = 0;
let commandCount = 0;
let averageDelay = 0;

/** Initialize bluetooth adapter */
async function initializeBluetooth(): Promise<void> {
  if (isInitialized) {
    log("Bluetooth already initialized");
    return;
  }

  return new Promise((resolve, reject) => {
    if (!hasListeners) {
      noble.on("stateChange", (state) => {
        log(`Bluetooth adapter state: ${state}`);
        if (state === "poweredOn") {
          isInitialized = true;
          resolve();
        } else if (state === "poweredOff") {
          log(
            "Bluetooth adapter is powered off. Please enable Bluetooth and try again.",
          );
          reject(new Error("Bluetooth adapter is powered off"));
        } else if (state === "unsupported") {
          reject(new Error("Bluetooth not supported on this device"));
        }
      });

      // Listener to log discovered devices
      noble.on("discover", (peripheral) => {
        if (!isSearchingForDevice) {
          log(
            `Found device: ${peripheral.address || peripheral.id} - "${peripheral.advertisement.localName || "Unknown device"}"`,
          );
        }
      });
      hasListeners = true;
    }

    // Wait 5 seconds for initialization
    setTimeout(() => {
      if (!isInitialized) {
        reject(
          new Error("Bluetooth initialization timeout - is Bluetooth enabled?"),
        );
      }
    }, 5000);
  });
}

/** Start scanning */
async function startScan(): Promise<void> {
  if (isScanning) {
    log("Already scanning");
    return;
  }

  await initializeBluetooth();

  return new Promise((resolve) => {
    log("Starting device scan...");
    noble.startScanning([], false);
    isScanning = true;
    resolve();
  });
}

/** Stop scanning */
function stopScan(): void {
  if (!isScanning) return;

  noble.stopScanning();
  isScanning = false;
  log("Stopped scanning for devices");
}

/** Connect to a specific device by MAC address
 * @param deviceAddress MAC address
 * @param serviceUUID Service UUID
 * @param characteristicUUID Characteristic UUID
 * @returns Connection
 */
async function connectToDevice(
  deviceAddress: string,
  serviceUUID: string,
  characteristicUUID: string,
): Promise<NobleConnection> {
  fnLog(`Bluetooth -- Attempting bluetooth connection @ ${deviceAddress}...`);

  log("Initializing Bluetooth adapter...");
  await initializeBluetooth();

  try {
    const peripheral = await findDevice(deviceAddress);

    log(`Connecting to peripheral: ${peripheral.address || peripheral.id}`);
    await connectPeripheral(peripheral);

    try {
      // Experimental optimization for high-frequency operations, might help
      const peripheralAny = peripheral as any;
      if (typeof peripheralAny.updateConnectionParameters === "function") {
        // Request minimum connection interval (7.5ms = 6*1.25ms)
        // Maximum connection interval (15ms = 12*1.25ms)
        // Slave latency (0 for responsiveness)
        // Supervision timeout (500ms = 50*10ms)
        await peripheralAny.updateConnectionParameters(6, 12, 0, 50);
        log("Optimized connection parameters for high frequency");
      } else {
        // MacOS specific optimization
        const nobleAny = noble as any;
        if (
          process.platform === "darwin" &&
          typeof nobleAny.setMTU === "function"
        ) {
          try {
            await nobleAny.setMTU(peripheral.id, 185);
            log("Set maximum MTU for better throughput");
          } catch (mtuErr) {
            log("Could not set MTU, using defaults");
          }
        }
      }
    } catch (err) {
      log("Could not update connection parameters, using defaults");
    }

    log("Discovering services...");
    const services = await discoverServices(peripheral, [serviceUUID]);

    if (services.length === 0) {
      throw new Error(`Service ${serviceUUID} not found on device`);
    }

    const service = services[0];
    log(`Found service: ${service.uuid}`);

    log("Discovering characteristics...");
    const characteristics = await discoverCharacteristics(service, [
      characteristicUUID,
    ]);

    if (characteristics.length === 0) {
      throw new Error(
        `Characteristic ${characteristicUUID} not found in service`,
      );
    }

    const characteristic = characteristics[0];
    log(`Found characteristic: ${characteristic.uuid}`);
    log("Characteristic properties:");
    console.log(characteristic.properties);

    if (
      !characteristic.properties.includes("write") &&
      !characteristic.properties.includes("writeWithoutResponse")
    ) {
      log("Warning: Characteristic may not support write operations");
    }

    const connection: NobleConnection = {
      peripheral,
      service,
      characteristic,
      connected: true,
      commandQueue: [],
      isProcessingQueue: false,
      performanceStats: {
        commandCount: 0,
        averageDelay: 0,
        commandsPerSecond: 0,
      },
      disconnect: async () => {
        if (connection.connected) {
          log("Disconnecting from device...");
          peripheral.disconnect();
          connection.connected = false;
          log("Device disconnected");
        }
      },
    };

    peripheral.once("disconnect", () => {
      log("Device disconnected unexpectedly");
      connection.connected = false;
    });

    startPerformanceMonitoring(connection);

    success("Successfully connected to device");
    return connection;
  } catch (err) {
    error("Failed to connect to device", err);
    throw err;
  } finally {
    stopScan();
  }
}

/** Find a device by MAC address
 * @param deviceAddress MAC address to search for
 * @returns Promise resolving to noble peripheral
 */
async function findDevice(deviceAddress: string): Promise<noble.Peripheral> {
  log(`Searching for device: ${deviceAddress}`);

  try {
    isSearchingForDevice = true;

    // @ts-ignore
    const knownPeripherals = noble._peripherals || {};
    const normalizedAddress = deviceAddress.toLowerCase().replace(/:/g, "");
    let knownDevices: noble.Peripheral[] = [];

    if (knownPeripherals instanceof Map) {
      knownDevices = Array.from(knownPeripherals.values());
    } else if (typeof knownPeripherals === "object") {
      knownDevices = Object.values(knownPeripherals);
    }

    const foundDevice = knownDevices.find((peripheral: any) => {
      const peripheralAddress = (peripheral.address || peripheral.id || "")
        .toLowerCase()
        .replace(/:/g, "");
      return peripheralAddress === normalizedAddress;
    });

    if (foundDevice) {
      log(`Device already discovered: ${deviceAddress}`);
      return foundDevice as Peripheral;
    }

    await startScan();

    return new Promise((resolve, reject) => {
      const discoveryHandler = (peripheral: noble.Peripheral) => {
        const peripheralAddress = (peripheral.address || peripheral.id || "")
          .toLowerCase()
          .replace(/:/g, "");

        if (peripheralAddress === normalizedAddress) {
          log(
            `Found device: ${peripheral.address || peripheral.id} - "${peripheral.advertisement.localName || "Unknown device"}"`,
          );
          log(
            `Found target device: ${deviceAddress} (${peripheral.advertisement.localName || "Unnamed"})`,
          );

          stopScan();

          noble.removeListener("discover", discoveryHandler);
          resolve(peripheral);
        }
      };

      noble.on("discover", discoveryHandler);

      setTimeout(() => {
        noble.removeListener("discover", discoveryHandler);
        reject(new Error(`Device not found: ${deviceAddress} (timeout)`));
      }, 15000);
    });
  } finally {
    isSearchingForDevice = false;
  }
}

/** Connect to a peripheral
 * @param peripheral Noble peripheral to connect to
 */
function connectPeripheral(peripheral: noble.Peripheral): Promise<void> {
  return new Promise((resolve, reject) => {
    peripheral.connect((error) => {
      if (error) {
        reject(error);
      } else {
        log(`Connected to ${peripheral.address || peripheral.id}`);
        resolve();
      }
    });
  });
}

/** Discover services on a peripheral
 * @param peripheral Connected peripheral
 * @param serviceUUIDs Array of service UUIDs to discover
 */
function discoverServices(
  peripheral: noble.Peripheral,
  serviceUUIDs: string[],
): Promise<noble.Service[]> {
  return new Promise((resolve, reject) => {
    peripheral.discoverServices(serviceUUIDs, (error, services) => {
      if (error) {
        reject(error);
      } else {
        resolve(services);
      }
    });
  });
}

/** Discover characteristics on a service
 * @param service Service to discover on
 * @param characteristicUUIDs Array of characteristic UUIDs to discover
 */
function discoverCharacteristics(
  service: noble.Service,
  characteristicUUIDs: string[],
): Promise<noble.Characteristic[]> {
  return new Promise((resolve, reject) => {
    service.discoverCharacteristics(
      characteristicUUIDs,
      (error, characteristics) => {
        if (error) {
          reject(error);
        } else {
          resolve(characteristics);
        }
      },
    );
  });
}

/** Set up performance monitoring
 * @param connection The connection to monitor
 */
function startPerformanceMonitoring(connection: NobleConnection) {
  commandCount = 0;
  averageDelay = 0;
  lastCommandTime = Date.now();

  const monitorInterval = setInterval(() => {
    if (!connection.connected) {
      clearInterval(monitorInterval);
      return;
    }

    const now = Date.now();
    const elapsed = now - lastCommandTime;
    if (elapsed > 0 && commandCount > 0) {
      const commandsPerSecond = (commandCount / elapsed) * 1000;
      connection.performanceStats = {
        commandCount,
        averageDelay,
        commandsPerSecond,
      };

      if (commandCount > 10) {
        log(
          `BLE Performance: ${commandsPerSecond.toFixed(2)} cmds/sec, avg delay: ${averageDelay.toFixed(2)}ms`,
        );
      }

      commandCount = 0;
      lastCommandTime = now;
    }
  }, 1000);
}

/** Process command queue for a connection
 * @param connection Active connection
 */
async function processCommandQueue(connection: NobleConnection) {
  if (connection.isProcessingQueue || connection.commandQueue.length === 0) {
    return;
  }

  connection.isProcessingQueue = true;

  try {
    while (connection.commandQueue.length > 0) {
      const command = connection.commandQueue.shift();
      if (command) {
        await command();
      }
    }
  } finally {
    connection.isProcessingQueue = false;
  }
}

/** Send device a raw optimized command for high-frequency operations
 * @param connection Active connection to device
 * @param data Buffer or number to send
 * @returns Promise that resolves when command is queued
 */
async function sendRawCommand(
  connection: NobleConnection,
  data: Buffer | number,
): Promise<void> {
  if (!connection || !connection.connected) {
    throw new Error("No active connection");
  }

  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from([data]);
  const useWriteWithoutResponse = connection.characteristic.properties.includes(
    "writeWithoutResponse",
  );

  if (
    !connection.characteristic.properties.includes("write") &&
    !useWriteWithoutResponse
  ) {
    throw new Error("Characteristic does not support write operations");
  }

  const startTime = Date.now();
  const trackTiming = () => {
    const endTime = Date.now();
    const delay = endTime - startTime;
    commandCount++;
    averageDelay =
      averageDelay === 0 ? delay : averageDelay * 0.9 + delay * 0.1;
  };

  return new Promise((resolve, reject) => {
    try {
      connection.characteristic.write(
        dataBuffer,
        useWriteWithoutResponse,
        (err) => {
          if (err) {
            reject(err);
          } else {
            trackTiming();
            resolve();
          }
        },
      );
    } catch (err) {
      reject(err);
    }
  });
}

/** Queue a command for execution on high-frequency operations
 * @param connection Active connection to device
 * @param data Buffer or number to send
 */
function queueCommand(
  connection: NobleConnection,
  data: Buffer | number,
): void {
  if (!connection || !connection.connected) {
    throw new Error("No active connection");
  }

  connection.commandQueue.push(() => sendRawCommand(connection, data));

  if (!connection.isProcessingQueue) {
    processCommandQueue(connection).catch((err) => {
      error("Error processing command queue", err);
    });
  }
}

/** Command to toggle device LED
 * @param connection Active connection to device
 * @param on True to turn on, false to turn off, or a number command
 * @returns Promise that resolves when command is sent
 */
async function toggleLight(
  connection: NobleConnection,
  on: boolean | string | number,
): Promise<void> {
  if (!connection || !connection.connected) {
    throw new Error("No active connection");
  }

  let data: Buffer;

  if (typeof on === "boolean") {
    data = Buffer.from([on ? 1 : 0]);
  } else if (typeof on === "number") {
    data = Buffer.from([on]);
  } else if (typeof on === "string") {
    if (on.length > 1) {
      log(
        "Warning: passing strings to toggleLight may cause performance issues",
      );
    }
    data = Buffer.from(on, "utf-8");
  } else {
    throw new Error("Invalid command type");
  }
  return sendRawCommand(connection, data);
}

/** Read the current value from the characteristic
 * @param connection Active connection
 * @returns Promise that resolves to the read value
 */
async function readValue(
  connection: NobleConnection,
): Promise<{ text: string; buffer: number[] }> {
  if (!connection || !connection.connected) {
    throw new Error("No active connection");
  }

  if (!connection.characteristic.properties.includes("read")) {
    throw new Error("Characteristic does not support read operations");
  }

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    connection.characteristic.read((err, data) => {
      const endTime = Date.now();
      if (err) {
        error("Failed to read value", err);
        reject(err);
      } else {
        const text = data.toString("utf-8");
        const bufferArray = Array.from(data);
        const readDelay = endTime - startTime;

        log(
          `Read completed in ${readDelay}ms: ${text} (hex: ${data.toString("hex")})`,
        );
        resolve({
          text,
          buffer: bufferArray as number[],
        });
      }
    });
  });
}

/** Get performance statistics for the connection
 * @param connection Active connection
 * @returns Current performance statistics
 */
function getPerformanceStats(connection: NobleConnection) {
  return connection.performanceStats;
}

export default {
  startScan,
  stopScan,
  connectToDevice,
  toggleLight,
  readValue,
  getPerformanceStats,
  queueCommand,
  sendRawCommand,
  initializeBluetooth,
  startPerformanceMonitoring,
  processCommandQueue,
  findDevice,
  connectPeripheral,
  discoverServices,
  discoverCharacteristics,
};
