import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type ArduinoSensor = {
  type: string;
  pin: string;
  state: string;
};

export default function ArduinoSensors() {
  const [arduinoSensors, setArduinoSensors] = useState<ArduinoSensor[]>([]);

  useEffect(() => {
    const unsub = window.electronIPC.onArduinoSensor((data: string) => {
      console.log(data);
      const newData = data.split(",");
      if (newData[0] === "led") {
        setArduinoSensors((prev) => {
          const outputData = [
            ...prev.filter((p) => p.pin != newData[1]),
            { type: "led", pin: newData[1], state: newData[2] },
          ];
          return outputData.sort((a, b) => parseInt(a.pin) - parseInt(b.pin));
        });
      } else if (newData[0] === "gas") {
        setArduinoSensors((prev) => {
          const outputData = [
            ...prev.filter((p) => p.pin != "14"),
            { type: "gas", pin: "14", state: newData[1] },
          ];
          return outputData.sort((a, b) => parseInt(a.pin) - parseInt(b.pin));
        });
      }
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-116 w-40 rounded-xl border border-white/20 p-3">
      <p className="mb-1 text-xl">Sensors</p>
      <>
        {arduinoSensors?.map((sensor) => (
          <div key={sensor.pin} className="flex justify-between">
            <p>
              {sensor.type}{" "}
              <span className="text-white/60">({sensor.pin})</span>
            </p>
            <p className={twMerge(sensor.state == "off" && "text-white/40")}>
              {sensor.state}
            </p>
          </div>
        ))}
      </>
    </div>
  );
}
