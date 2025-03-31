import { fileURLToPath } from "url";
import { app } from "electron";
import path from "path";
import fs from "fs";

import { isDev } from "./utils/utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getAppRoot() {
  return path.join(__dirname, "..");
}

function getPreloadPath() {
  return path.join(__dirname, "preload.cjs");
}

function getUIPath() {
  return path.join(app.getAppPath() + "/dist-react/index.html/");
}

function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}

function getProjectDirectory() {
  let projectPath;

  if (isDev()) {
    // In development, save to a 'recordings' folder in the project directory
    projectPath = path.join(__dirname, "..", "recordings");
  } else {
    // In production, save to user's documents folder
    const documentsPath = app.getPath("documents");
    projectPath = path.join(documentsPath, "JohnnyFiveTest", "recordings");
  }

  // Ensure the directory exists
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  console.log("Project directory path:", projectPath);
  return projectPath;
}

export default {
  getAppRoot,
  getPreloadPath,
  getUIPath,
  getAssetPath,
  getProjectDirectory,
};
