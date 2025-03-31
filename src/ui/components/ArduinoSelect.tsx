import { useAtom } from "jotai";
import { serialDevicesAtom, trialDataAtom } from "../atoms/trialAtoms";

export default function ArduinoSelect() {
  const [serialDevices, refreshSerialDevices] = useAtom(serialDevicesAtom);
  const [trialData, setTrialData] = useAtom(trialDataAtom);

  return (
    <div className="flex gap-2">
      <select
        className="bg-bg w-full rounded-md border border-white/30 bg-neutral-800 p-2"
        value={trialData.arduinoPath}
        onChange={(e) =>
          setTrialData(() => ({
            ...trialData,
            arduinoPath: e.target.value,
          }))
        }
      >
        <option value="">Select Port</option>
        {serialDevices.state == "loading" ? (
          <option value="">Loading</option>
        ) : serialDevices.state == "hasError" ? (
          <option value="">Error.</option>
        ) : (
          serialDevices.data.length > 0 && (
            <>
              {serialDevices.data?.map((dev) => (
                <option key={dev.path} value={dev.path}>
                  {dev.path}
                </option>
              ))}
            </>
          )
        )}
      </select>
      <button
        type="button"
        onClick={() => refreshSerialDevices()}
        className="w-26 rounded-md border border-white bg-white p-1.5 text-lg font-semibold text-black/80 duration-150 hover:bg-white/60"
      >
        Refresh
      </button>
    </div>
  );
}
