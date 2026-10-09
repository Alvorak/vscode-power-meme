import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { playAudio } from "./audioPlayer";

export type MemeType = "ok" | "error";

export async function showEditorMeme(
  context: vscode.ExtensionContext,
  type: MemeType,
  customGifPath?: string,
): Promise<void> {
  const editor =
    vscode.window.activeTextEditor ??
    vscode.window.visibleTextEditors[0];

  if (!editor) {
    return;
  }

  const assetFolder = path.join(
    context.extensionPath,
    "overlay",
    "assets",
    type,
  );

  const defaultGifPath = path.join(
    assetFolder,
    "meme.gif",
  );

  const normalizedCustomGifPath = customGifPath?.trim();

  const gifPath =
    normalizedCustomGifPath &&
      fs.existsSync(normalizedCustomGifPath)
      ? normalizedCustomGifPath
      : defaultGifPath;

  if (!fs.existsSync(gifPath)) {
    vscode.window.showErrorMessage(
      `Power Meme: GIF not found: ${gifPath}`,
    );

    return;
  }

  const gifExtension = path.extname(gifPath).toLowerCase();

  if (gifExtension !== ".gif") {
    vscode.window.showErrorMessage(
      "Power Meme: Selected file must be a GIF.",
    );

    return;
  }

  const parsedGifPath = path.parse(gifPath);

  const audioPath = path.join(
    parsedGifPath.dir,
    `${parsedGifPath.name}.wav`,
  );

  const decorationType =
    vscode.window.createTextEditorDecorationType({
      after: {
        contentIconPath: vscode.Uri.file(gifPath),
        margin: "0 0 0 150px",
        width: "300px",
        height: "220px",
      },
    });

  const cursorPosition = editor.selection.active;

  const cursorRange = new vscode.Range(
    cursorPosition,
    cursorPosition,
  );

  editor.setDecorations(
    decorationType,
    [cursorRange],
  );

  if (!fs.existsSync(audioPath)) {
    setTimeout(() => {
      decorationType.dispose();
    }, 3000);

    return;
  }

  const audioProcess = playAudio(audioPath);

  if (!audioProcess) {
    setTimeout(() => {
      decorationType.dispose();
    }, 3000);

    return;
  }

  audioProcess.on("exit", (code) => {
    if (code === 127) {
      setTimeout(() => {
        decorationType.dispose();
      }, 3000);

      return;
    }

    decorationType.dispose();
  });

  audioProcess.on("exit", () => {
    decorationType.dispose();
  });
}