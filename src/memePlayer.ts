import * as vscode from "vscode";
import * as path from "path";
import { spawn } from "child_process";
import * as fs from "fs";

let isPlaying = false;

export function playMeme(volume: number, videoPath?: string): void {
  if (isPlaying) {
    return;
  }

  try {
    const electronModulePath = path.join(
      __dirname,
      "..",
      "node_modules",
      "electron",
    );

    const electronPath: string = require(electronModulePath);

    const overlayPath = path.join(__dirname, "..", "overlay", "main.js");

    const defaultVideoPath = path.join(
      __dirname,
      "..",
      "overlay",
      "assets",
      "meme.mp4",
    );

    const selectedVideoPath =
      videoPath && videoPath.trim().length > 0 ? videoPath : defaultVideoPath;

    if (!fs.existsSync(selectedVideoPath)) {
      vscode.window.showErrorMessage(
        `Power Meme: Video file not found: ${selectedVideoPath}`,
      );

      return;
    }

    const allowedExtensions = [".mp4", ".webm", ".mov", ".mkv"];

    const extension = path.extname(selectedVideoPath).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      vscode.window.showErrorMessage(
        `Power Meme: Unsupported video format: ${extension || "unknown"}`,
      );

      return;
    }
    
    const environment = {
      ...process.env,
    };

    delete environment.ELECTRON_RUN_AS_NODE;

    isPlaying = true;

    const child = spawn(
      electronPath,
      [overlayPath, volume.toString(), selectedVideoPath],
      {
        env: environment,
      },
    );

    child.on("error", (error) => {
      isPlaying = false;

      vscode.window.showErrorMessage(`Meme error: ${error.message}`);
    });

    child.on("exit", () => {
      isPlaying = false;
    });
  } catch (error) {
    isPlaying = false;

    const message = error instanceof Error ? error.message : String(error);

    vscode.window.showErrorMessage(`Could not launch meme: ${message}`);
  }
}
