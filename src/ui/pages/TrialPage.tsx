/**
 *
 * Page that handles the trial system
 *
 * Inputs:
 *  name
 *  description string
 *  arduinoPath string
 *  cameraPath string
 *  btDeviceMac string
 *  status string
 *  duration number (s) "-1 for inf"
 *  trialParams {
 *    ledPin number
 *    beambreakPin number
 *    atomizerPin number
 *    pumpInPin number
 *    pumpOutPin number
 *  }
 *  data {}
 *  logs {}
 *  outputVideoPath string
 *
 *
 * Outputs:
 *  - Trial Data / Logs
 *  - Output Video
 *
 */
import CameraInputPreview from "../components/CameraInputPreview";
import { trialDataAtom } from "../atoms/trialAtoms";
import { useAtom } from "jotai";
import ArduinoSelect from "../components/ArduinoSelect";

import { primeBeamBreak, runTrial, unprimeBeamBreak } from "../api/trialAPI";

export default function TrialPage() {
  const [trialData, setTrialData] = useAtom(trialDataAtom);

  const handleSave = async () => {
    console.log(trialData);
  };

  const handleRun = async () => {
    console.log("Running Trial! \n", trialData);
    runTrial(trialData);
  };

  return (
    <form
      action={handleSave}
      className="mb-8 grid h-full w-full grid-cols-12 items-center justify-center gap-4 px-4"
    >
      {/* LS, Basic Inputs & Camera Input @ Bottom */}
      <div className="trialGridSide col-span-5">
        <div className="trialGridBox">
          <p>Trial Name</p>
          <input
            className="trialGridBoxInput"
            type="text"
            placeholder="Type Something..."
            value={trialData.name}
            onChange={(e) => {
              setTrialData({
                ...trialData,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div className="trialGridBox">
          <p>Description</p>
          <textarea
            className="trialGridBoxInput h-18 max-h-18 min-h-18"
            placeholder="Type Something..."
            value={trialData.description}
            onChange={(e) => {
              setTrialData({
                ...trialData,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div className="trialGridBox">
          <p>Arduino Input</p>
          <ArduinoSelect />
        </div>
        <CameraInputPreview />
      </div>

      {/* RS, Bluetooth inputs & Trial Parameters + Action Btns */}
      <div className="trialGridSide col-span-7">
        <div className="trialGridBox flex-grow">
          <p>Bluetooth devices</p>
          <div className="trialGridBoxInput flex-grow text-white/50">
            <p>{`Bluetooth Device #1 {`}</p>
            <p>
              {`friendlyName: `}
              <span className="text-white">MATT_832_Test</span>
            </p>
            <p>
              {`macAddress: `}
              <span className="text-white">{trialData.btDeviceMac}</span>
            </p>
            <p>{`}`}</p>
          </div>
        </div>
        <div className="trialGridBox flex-grow">
          <p>Trial Parameters</p>
          <div className="trialGridBoxInput flex-grow">
            <p>
              <span className="text-white/50">Led Pin</span>{" "}
              {trialData.trialParams.ledPin}
            </p>
            <p>
              <span className="text-white/50">Beam Break Pin</span>{" "}
              {trialData.trialParams.beambreakPin}
            </p>
            <p>
              <span className="text-white/50">Atomizer Pin</span>{" "}
              {trialData.trialParams.atomizerPin}
            </p>
            <p>
              <span className="text-white/50">Pump In Pin</span>{" "}
              {trialData.trialParams.pumpInPin}
            </p>
            <p>
              <span className="text-white/50">Pump Out Pin</span>{" "}
              {trialData.trialParams.pumpOutPin}
            </p>
          </div>
        </div>
        <div className="trialGridBox">
          <p>Duration</p>
          <input
            className="trialGridBoxInput"
            type="text"
            placeholder="Trial Duration (s)... input -1 for inf"
            value={trialData.duration}
            onChange={(e) => {
              setTrialData({
                ...trialData,
                duration: e.target.value,
              });
            }}
          />
        </div>
        <div className="trialGridBox">
          <p>Start & Stop btns</p>
          <div className="flex gap-3">
            <button
              type="submit"
              value="submit"
              className="h-full w-full flex-grow rounded-xl border border-white/20 bg-neutral-800/50 py-3 duration-150 hover:bg-neutral-800"
            >
              Save
            </button>
            <button
              className="h-full w-full flex-grow rounded-xl border border-green-500/20 bg-green-500/50 py-3 duration-150 hover:bg-green-500"
              type="button"
              onClick={handleRun}
            >
              Run
            </button>
          </div>
        </div>
      </div>

      {/* Output area, shows during and after trial run */}
      <div className="hidden">
        <div>Trial Data / Logs</div>
        <div>Output Video and timestamps</div>
      </div>
    </form>
  );
}
