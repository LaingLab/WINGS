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

async function ensureConnections() {}

async function initializeTriggers() {}

async function startLogger() {}

async function initalizeTrial() {}

/**
 *
 * Run trial
 *    start recording - frontend
 *    enable serial devices - backend
 *    start broadcasting to ble devices - backend
 *    log changes/triggers/outputs - frontend/backend
 *    loop until completed - frontend/backend
 */

async function runTrial() {}

/** Cleanup
 *    save logs to file - backend
 *    save data to file(s) - backend
 *    save Recording to file - frontend/backend
 *    disconnect serial arduino and clean johnnyfive - backend
 *    disconnect and clean bluetooth arduino - backend
 *    output data to user - frontend/backend
 */

async function saveLogs() {}

async function saveData() {}

async function saveRecording() {}

async function ensureDisconnects() {}

async function cleanupTrial() {}
