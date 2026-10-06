import * as vscode from "vscode";
import { isCodeExecution } from "./commandDetector";
import { playMeme } from "./memePlayer";

export function activate(context: vscode.ExtensionContext) {
  const terminalListener = vscode.window.onDidEndTerminalShellExecution(
    (event) => {
      const config = vscode.workspace.getConfiguration("powerMeme");
      const enabled = config.get<boolean>("enabled", true);

      if (!enabled) {
        return;
      }

      const command = event.execution.commandLine.value;
      const exitCode = event.exitCode;

      if (!isCodeExecution(command)) {
        return;
      }

      const volume = config.get<number>("volume", 0.7);

      if (exitCode === 0) {
        const playOnSuccess = config.get<boolean>("playOnSuccess", true);

        if (!playOnSuccess) {
          return;
        }

        const successVideoPath = config.get<string>(
          "successVideoPath",
          ""
        );

        playMeme(volume, successVideoPath);
        return;
      }

      const playOnError = config.get<boolean>("playOnError", false);

      if (!playOnError) {
        return;
      }

      const errorVideoPath = config.get<string>(
        "errorVideoPath",
        ""
      );

      playMeme(volume, errorVideoPath);
    },
  );

  context.subscriptions.push(terminalListener);
}

export function deactivate() {}