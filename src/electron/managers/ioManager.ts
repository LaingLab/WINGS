import { SerialPort } from "serialport";

async function getSerialDevices() {
  try {
    const ports = await SerialPort.list();
    return ports.map((port) => ({
      ...port,
      path: port.path,
      manufacturer: port.manufacturer,
      serialNumber: port.serialNumber,
      pnpId: port.pnpId,
      locationId: port.locationId,
      vendorId: port.vendorId,
      productId: port.productId,
    }));
  } catch (error) {
    console.error("Error listing serial ports:", error);
    return [];
  }
}

export default {
  getSerialDevices,
};
