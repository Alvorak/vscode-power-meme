/// <reference types="node" />

const { app, BrowserWindow } = require("electron");
const path = require("path");

const volume = Number(process.argv[2] ?? 0.7);
const videoPath = process.argv[3];

function createOverlay() {
  const window = new BrowserWindow({
    width: 700,
    height: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    focusable: false,
    webPreferences: {
      contextIsolation: true,
    },
  });

  window.setIgnoreMouseEvents(true);

  window.loadFile(path.join(__dirname, "index.html"), {
    query: {
      volume: volume.toString(),
      videoPath: videoPath ?? "",
    },
  });
}

app.whenReady().then(() => {
  createOverlay();
});

app.on("window-all-closed", () => {
  app.quit();
});