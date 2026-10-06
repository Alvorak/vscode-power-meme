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

  const selectSuccessVideoCommand = vscode.commands.registerCommand(
    "powerMeme.selectSuccessVideo",
    async () => {
      const selection = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          Videos: ["mp4", "webm", "mov", "mkv"],
        },
        openLabel: "Select Success Video",
      });

      if (!selection || selection.length === 0) {
        return;
      }

      const selectedPath = selection[0].fsPath;

      const config = vscode.workspace.getConfiguration("powerMeme");

      await config.update(
        "successVideoPath",
        selectedPath,
        vscode.ConfigurationTarget.Global,
      );

      vscode.window.showInformationMessage(
        "Power Meme: Success video updated.",
      );
    },
  );

  context.subscriptions.push(
    terminalListener,
    selectSuccessVideoCommand,
  );
}

export function deactivate() { }