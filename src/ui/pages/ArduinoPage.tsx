import { useEffect, useState } from "react";
import {
  connect,
  disconnect,
  prime,
  unprime,
  testLights,
} from "../api/arduinoAPI";
import ArduinoLogs from "../components/ArduinoLogs";

type ArduinoState =
  | "primed"
  | "unprimed"
  | "disconnected"
  | "connected"
  | "initializing"
  | "running"
  | "waiting";

export default function ArduinoPage() {
  const [arduinoState, setArduinoState] =
    useState<ArduinoState>("disconnected");
  const [toggleData, setToggleData] = useState<
    Record<string, number | string | null>
  >({ pin: null, state: "" });

  useEffect(() => {
    const unsub = window.electronIPC.onArduinoUpdate((data: string) => {
      setArduinoState(data as ArduinoState);
    });
    return unsub;
  }, []);

  const handleLedToggle = (state: string) => {
    if (toggleData?.pin) {
      console.log(`Toggling Led @ ${toggleData.pin} ${state}`);
      window.electronIPC.arduino("toggle-led", {
        pin: toggleData.pin,
        state,
      });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center gap-12 p-3 px-5">
      <div className="flex flex-col gap-3">
        <p className="text-2xl">Arduino Page</p>
        <p className="mb-4">Arduino State: {arduinoState}</p>
        <button
          className="btn bg-green-500/80 hover:bg-green-500/40"
          onClick={connect}
        >
          Connect
        </button>
        <button
          className="btn bg-red-500/80 hover:bg-red-500/40"
          onClick={disconnect}
        >
          Disconnect
        </button>
        <button
          className="btn mt-2 bg-white text-black hover:bg-white/40"
          onClick={prime}
        >
          Prime
        </button>
        <button
          className="btn bg-white text-black hover:bg-white/40"
          onClick={unprime}
        >
          Unprime
        </button>
        <button
          className="btn bg-white text-black hover:bg-white/40"
          onClick={testLights}
        >
          Test Lights
        </button>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="pin"
            value={toggleData.pin || 0}
            onChange={(e) =>
              setToggleData({
                ...toggleData,
                pin: parseInt(e.target.value),
              })
            }
          />
          <button onClick={() => handleLedToggle("on")}>On</button>
          <button onClick={() => handleLedToggle("off")}>Off</button>
        </div>
      </div>
      <ArduinoLogs />
    </div>
  );
}
