import { useEffect, useState } from "react";

type Log = {
  data: string;
  time: string;
};

export default function ArduinoLogs() {
  const [arduinoLogs, setArduinoLogs] = useState<Log[]>([]);

  useEffect(() => {
    const unsub = window.electronIPC.onArduinoLog((data: string) => {
      setArduinoLogs((prev: Log[]) => {
        const newLog = { data, time: new Date().toLocaleTimeString() };
        const newData = [...prev, newLog];

        return newData;
      });
    });
    return unsub;
  }, []);

  return (
    <div className="w-150">
      <div className="flex min-h-96 flex-col rounded-xl border border-white/20 p-4">
        <p className="mb-1 text-xl">Logs</p>
        <div className="h-100 overflow-y-auto">
          {arduinoLogs?.map((log: Log, index) => (
            <p key={index}>
              <span className="text-sm text-white/60">[{log.time}]</span>{" "}
              {log.data}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
