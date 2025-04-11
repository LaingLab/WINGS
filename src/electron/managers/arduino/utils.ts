import { mainWindow } from "../../main.js";

export const wait = async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return 1;
};

export const log = (message: string) => {
  console.log(`[Arduino] <LOG> ${message}`);
  mainWindow.webContents.send("arduino-log", `${message}`);
  return 1;
};

export const update = (data: string) => {
  console.log(`[Arduino] <UPDATE> ${data}`);
  mainWindow.webContents.send("arduino-update", data);
  return 1;
};

export const updateSensor = (data: string) => {
  console.log(`[Arduino] <SENSOR> ${data}`);
  mainWindow.webContents.send("arduino-sensor", data);
  return 1;
};
