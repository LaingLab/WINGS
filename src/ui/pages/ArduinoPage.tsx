import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { connect, disconnect, prime, unprime } from "../api/arduinoAPI";

import { arduinoLogAtom } from "../atoms/arduinoAtoms";

type Log = {
  data: string;
  time: string;
};

type ArduinoState =
  | "primed"
  | "unprimed"
  | "disconnected"
  | "connected"
  | "initializing"
  | "running"
  | "waiting";

export default function ArduinoPage() {
  const [newLog, setNewLog] = useState<Log | null>();
  const [arduinoLogs, setArduinoLogs] = useAtom<Log[]>(arduinoLogAtom);
  const [arduinoState, setArduinoState] =
    useState<ArduinoState>("disconnected");

  useEffect(() => {
    window.electronIPC.onArduinoLog((data: string) => {
      setNewLog({ data, time: new Date().toISOString() });
    });
    window.electronIPC.onArduinoUpdate((data: string) => {
      setArduinoState(data as ArduinoState);
    });
  }, []);

  useEffect(() => {
    if (newLog?.data && newLog?.time) {
      setArduinoLogs([...arduinoLogs, newLog]);
    }
    setNewLog(null);
  }, [newLog]);

  return (
    <div className="flex h-full w-full items-center justify-between gap-20 p-3 px-5">
      <div className="flex flex-grow flex-col items-center gap-3">
        <p>Arduino Page</p>
        <p>Arduino State: {arduinoState}</p>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
        <button onClick={prime}>Prime</button>
        <button onClick={unprime}>Unprime</button>
      </div>
      <div className="flex flex-grow flex-col items-center gap-3">
        <p>Arduino Data</p>
        {arduinoLogs?.map((log: Log, index) => (
          <p key={index}>
            [{log.time}] {log.data}
          </p>
        ))}
      </div>
    </div>
  );
}
