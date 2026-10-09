import * as vscode from "vscode";
import {
  isCodeExecution,
  isPersistentCodeExecution,
} from "./commandDetector";
import { showEditorMeme } from "./editorMemePlayer";

export function activate(context: vscode.ExtensionContext) {
  const terminalStartListener =
    vscode.window.onDidStartTerminalShellExecution(
      async (event) => {
        const config =
          vscode.workspace.getConfiguration("powerMeme");

        const enabled = config.get<boolean>(
          "enabled",
          true,
        );

        if (!enabled) {
          return;
        }

        const command =
          event.execution.commandLine.value;

        if (!isPersistentCodeExecution(command)) {
          return;
        }

        let finished = false;

        const successTimer = setTimeout(async () => {
          if (finished) {
            return;
          }

          finished = true;

          const playOnSuccess = config.get<boolean>(
            "playOnSuccess",
            true,
          );

          if (!playOnSuccess) {
            return;
          }

          const successGifPath = config.get<string>(
            "successGifPath",
            "",
          );

          await showEditorMeme(
            context,
            "ok",
            successGifPath,
          );
        }, 2500);

        const errorPatterns: RegExp[] = [
          /\berror\b/i,
          /\bfailed\b/i,
          /\bfailure\b/i,
          /\bexception\b/i,
          /syntaxerror/i,
          /typeerror/i,
          /referenceerror/i,
          /transform failed/i,
          /uncaughtexception/i,
        ];

        for await (const output of event.execution.read()) {
          if (finished) {
            break;
          }

          const hasError = errorPatterns.some((pattern) =>
            pattern.test(output),
          );

          if (!hasError) {
            continue;
          }

          finished = true;
          clearTimeout(successTimer);

          const playOnError = config.get<boolean>(
            "playOnError",
            false,
          );

          if (!playOnError) {
            return;
          }

          const errorGifPath = config.get<string>(
            "errorGifPath",
            "",
          );

          await showEditorMeme(
            context,
            "error",
            errorGifPath,
          );

          return;
        }
        
        const playOnSuccess = config.get<boolean>(
          "playOnSuccess",
          true,
        );

        if (!playOnSuccess) {
          return;
        }

        const successGifPath = config.get<string>(
          "successGifPath",
          "",
        );

        await showEditorMeme(
          context,
          "ok",
          successGifPath,
        );
      },
    );

  const terminalListener =
    vscode.window.onDidEndTerminalShellExecution(
      async (event) => {
        const config =
          vscode.workspace.getConfiguration("powerMeme");

        const enabled = config.get<boolean>(
          "enabled",
          true,
        );

        if (!enabled) {
          return;
        }

        const command =
          event.execution.commandLine.value;

        const exitCode = event.exitCode;

        if (!isCodeExecution(command)) {
          return;
        }

        if (isPersistentCodeExecution(command)) {
          return;
        }

        if (exitCode === 0) {
          const playOnSuccess = config.get<boolean>(
            "playOnSuccess",
            true,
          );

          if (!playOnSuccess) {
            return;
          }

          const successGifPath = config.get<string>(
            "successGifPath",
            "",
          );

          await showEditorMeme(
            context,
            "ok",
            successGifPath,
          );

          return;
        }

        const playOnError = config.get<boolean>(
          "playOnError",
          false,
        );

        if (!playOnError) {
          return;
        }

        const errorGifPath = config.get<string>(
          "errorGifPath",
          "",
        );

        await showEditorMeme(
          context,
          "error",
          errorGifPath,
        );
      },
    );

  const selectSuccessGifCommand =
    vscode.commands.registerCommand(
      "powerMeme.selectSuccessGif",
      async () => {
        const selection =
          await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
              GIF: ["gif"],
            },
            openLabel: "Select Success GIF",
          });

        if (!selection || selection.length === 0) {
          return;
        }

        const selectedPath = selection[0].fsPath;

        const config =
          vscode.workspace.getConfiguration("powerMeme");

        await config.update(
          "successGifPath",
          selectedPath,
          vscode.ConfigurationTarget.Global,
        );

        vscode.window.showInformationMessage(
          "Power Meme: Success GIF updated.",
        );
      },
    );

  const selectErrorGifCommand =
    vscode.commands.registerCommand(
      "powerMeme.selectErrorGif",
      async () => {
        const selection =
          await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
              GIF: ["gif"],
            },
            openLabel: "Select Error GIF",
          });

        if (!selection || selection.length === 0) {
          return;
        }

        const selectedPath = selection[0].fsPath;

        const config =
          vscode.workspace.getConfiguration("powerMeme");

        await config.update(
          "errorGifPath",
          selectedPath,
          vscode.ConfigurationTarget.Global,
        );

        vscode.window.showInformationMessage(
          "Power Meme: Error GIF updated.",
        );
      },
    );

  const resetMemesCommand =
    vscode.commands.registerCommand(
      "powerMeme.resetMemes",
      async () => {
        const config =
          vscode.workspace.getConfiguration("powerMeme");

        await config.update(
          "successGifPath",
          "",
          vscode.ConfigurationTarget.Global,
        );

        await config.update(
          "errorGifPath",
          "",
          vscode.ConfigurationTarget.Global,
        );

        vscode.window.showInformationMessage(
          "Power Meme: Meme paths reset to default.",
        );
      },
    );

  const testEditorMemeCommand =
    vscode.commands.registerCommand(
      "powerMeme.testEditorMeme",
      async () => {
        const config =
          vscode.workspace.getConfiguration("powerMeme");

        const successGifPath = config.get<string>(
          "successGifPath",
          "",
        );

        await showEditorMeme(
          context,
          "ok",
          successGifPath,
        );
      },
    );

  context.subscriptions.push(
    terminalStartListener,
    terminalListener,
    selectSuccessGifCommand,
    selectErrorGifCommand,
    resetMemesCommand,
    testEditorMemeCommand,
  );
}

export function deactivate() { }