import { atom } from "jotai";
import { atomWithRefresh, loadable } from "jotai/utils";

export const trialDataAtom = atom({
  name: "",
  description: "",
  arduinoPath: "",
  cameraPath: "",
  btDeviceMac: "DB:58:B9:A7:EF:12",
  status: "disabled",
  duration: "",
  trialParams: {
    ledPin: 12,
    beambreakPin: 4,
    atomizerPin: 7,
    pumpInPin: 10,
    pumpOutPin: 13,
  },
  data: {},
  logs: {},
  videoFileName: "",
});

const refreshSerialDevicesAtom = atomWithRefresh(
  async () =>
    new Promise<any[]>((resolve) =>
      setTimeout(
        () => resolve(window.electronIPC.io("get-serial-devices")),
        Math.random() * 200 + 200,
      ),
    ),
);
const loadableSerialDevicesAtom = loadable(refreshSerialDevicesAtom);
export const serialDevicesAtom = atom(
  (get) => get(loadableSerialDevicesAtom),
  (_get, set) => set(refreshSerialDevicesAtom),
);
