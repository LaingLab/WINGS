import { useEffect, useState } from "react";
import {
  connect,
  disconnect,
  prime,
  unprime,
  testLights,
} from "../api/arduinoAPI";
import ArduinoLogs from "../components/ArduinoLogs";
import ArduinoSensors from "../components/ArduinoSensor";

type ArduinoState =
  | "disconnected"
  | "connected"
  | "initializing"
  | "running"
  | "waiting";

export default function ArduinoPage() {
  const [arduinoState, setArduinoState] =
    useState<ArduinoState>("disconnected");
  const [isPrimed, setIsPrimed] = useState<"primed" | "unprimed" | "--">("--");

  useEffect(() => {
    const unsub = window.electronIPC.onArduinoUpdate((data: string) => {
      if (data == "primed" || data == "unprimed") {
        setIsPrimed(data);
      } else {
        setArduinoState(data as ArduinoState);
      }
    });
    return unsub;
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center gap-3 p-3 px-5">
      {/* Info & Btns */}
      <div className="mr-4 flex flex-col gap-3">
        <div>
          <p className="mb-1 text-2xl font-semibold">Arduino Page</p>
          <p className="">Arduino State: {arduinoState}</p>
          <p className="mb-4">Primed State: {isPrimed}</p>
        </div>

        {/* Buttons */}
        <ArduinoButtons />
      </div>

      {/* Logs */}
      <ArduinoLogs />

      {/* Sensors */}
      <ArduinoSensors />
    </div>
  );
}

function ArduinoButtons() {
  const [toggleData, setToggleData] = useState<
    Record<string, number | string | null>
  >({ pin: null, state: "" });

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
    <div className="flex flex-col gap-2">
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
      <div className="flex gap-1">
        <input
          className="rounded-xl border border-white/20 p-2"
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
        <button
          className="rounded-xl border border-white/20 p-2"
          onClick={() => handleLedToggle("on")}
        >
          On
        </button>
        <button
          className="rounded-xl border border-white/20 p-2"
          onClick={() => handleLedToggle("off")}
        >
          Off
        </button>
      </div>
    </div>
  );
}
