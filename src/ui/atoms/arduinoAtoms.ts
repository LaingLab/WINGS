import { atom } from "jotai";

type Log = {
  data: string;
  time: string;
};

export const arduinoLogAtom = atom<Log[]>([
  { data: "Welcome!", time: new Date().toISOString() },
]);
