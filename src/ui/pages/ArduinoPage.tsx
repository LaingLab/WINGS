import { useEffect, useState } from "react";
import { connect, disconnect, prime, unprime } from "../api/arduinoAPI";

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
  | "waiting";

export default function ArduinoPage() {
  const [arduinoLogs, setArduinoLogs] = useState<Log[] | null>(null);
  const [arduinoState, setArduinoState] =
    useState<ArduinoState>("disconnected");

  const handleEventData = (type, data) => {
    console.log(`Received data: <${type}>`, data);
    if (type === "update") {
      setArduinoState(data);
    } else if (type === "log") {
      const log = { data, time: new Date().toISOString() };
      const newLogs = arduinoLogs != null ? [...arduinoLogs, log] : [log];
      setArduinoLogs(newLogs);
    }
  };

  useEffect(() => {
    window.electronIPC.onArduinoLog((data: string) => {
      handleEventData("log", data);
    });
    window.electronIPC.onArduinoUpdate((data: string) => {
      handleEventData("update", data);
    });
  }, []);

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
