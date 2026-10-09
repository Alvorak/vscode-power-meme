import { ChildProcess, spawn } from "child_process";

export function playAudio(
    audioPath: string,
): ChildProcess | undefined {
    if (process.platform === "win32") {
        const escapedAudioPath = audioPath.replace(/'/g, "''");

        return spawn(
            "powershell.exe",
            [
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                `$player = New-Object System.Media.SoundPlayer '${escapedAudioPath}'; $player.PlaySync();`,
            ],
            {
                windowsHide: true,
                stdio: "ignore",
            },
        );
    }

    if (process.platform === "darwin") {
        return spawn(
            "afplay",
            [audioPath],
            {
                stdio: "ignore",
            },
        );
    }

    if (process.platform === "linux") {
        return spawn(
            "sh",
            [
                "-c",
                `
if command -v paplay >/dev/null 2>&1; then
  exec paplay "$1"
elif command -v aplay >/dev/null 2>&1; then
  exec aplay "$1"
else
  exit 127
fi
        `,
                "power-meme-audio",
                audioPath,
            ],
            {
                stdio: "ignore",
            },
        );
    }

    return undefined;
}