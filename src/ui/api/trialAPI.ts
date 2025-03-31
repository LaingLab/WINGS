/**
 *
 * Api file to handle trial stuff
 *
 */
const initializeTrial = async (trialData) => {
  console.log("Initializing Trial...");
  try {
    const connected = await window.electronIPC
      .arduino("connect", trialData.arduinoPath)
      .then(() => {
        if (connected != "ready") {
          console.error("Arduino not connected.");
          return "arduino not connected.";
        }

        console.log("Arduino ", trialData.arduinoPath, " connected.");
        return true;
      });
  } catch (e) {
    console.error("Error init trial", e);
    return false;
  }
};

export const runTrial = async (trialData) => {
  /**
   * save trial info to json file
   *
   * initialize trial devices
   *    connect to bluetooth arduino - backend
   *    connect to serial arduino - backend
   *    initialize triggers and outputs - backend
   *    ensure camera is active - frontend
   *    start logging - frontend/backend
   */
  try {
    await initializeTrial(trialData).then(async () => {
      console.log("Arduino trial started.");
      try {
        // start recording

        // start ble stuff

        // start logging

        // figure out loop system
        try {
          await trialCleanUp();
        } catch (e) {
          console.error("Error during cleanup", e);
        }
      } catch (e) {
        console.error("Error running trial", e);
      }
    });
  } catch (e) {
    console.error("Error initializing trial", e);
  }
  /**
   *
   * Run trial
   *    start recording - frontend
   *    enable serial devices - backend
   *    start broadcasting to ble devices - backend
   *    log changes/triggers/outputs - frontend/backend
   *    loop until completed - frontend/backend
   */

  /** Cleanup
   *    save logs to file - backend
   *    save data to file(s) - backend
   *    save Recording to file - frontend/backend
   *    disconnect serial arduino and clean johnnyfive - backend
   *    disconnect and clean bluetooth arduino - backend
   *    output data to user - frontend/backend
   *
   */
};

const trialCleanUp = async () => {
  try {
    window.electronIPC.arduino("disconnect", null);
  } catch (e) {
    console.error("Error disconnecting", e);
  }
};
