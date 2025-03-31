import { SerialPort } from "serialport";

async function getSerialDevices() {
  console.log("Device -- [get-serial-devices]");
  const ports = await SerialPort.list();
  const filteredPorts = ports.filter((port) => port.vendorId && port.productId);
  if (filteredPorts.length === 0) {
    console.log("no serial devices found");
    return { success: false, message: "No serial devices found", data: [] };
  }
  return filteredPorts;
}

export default {
  getSerialDevices,
};
