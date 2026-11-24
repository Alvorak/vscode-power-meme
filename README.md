# Power Meme

Power Meme shows a short meme GIF in Visual Studio Code when a supported command succeeds or fails in the integrated terminal. You can choose separate GIFs for success and failure and pair them with optional WAV audio.

## Installation

Open **Extensions** in VS Code, search for `@id:alvorak.vscode-power-meme`, and select **Install**. Power Meme requires VS Code 1.95.0 or later and [terminal shell integration](https://code.visualstudio.com/docs/terminal/shell-integration) for automatic command detection.

## Quick start

1. Open a text file in the editor and start a new integrated terminal.
2. If you have Node.js installed, run `node -e "console.log('hello')"` to see the success GIF.
3. To try the error GIF, enable `powerMeme.playOnError` in Settings and run `node -e "process.exit(1)"`.

You can also run **Power Meme: Test Editor Meme** from the Command Palette to preview the success GIF without running a terminal command.

## Customize your memes

Open the Command Palette and run **Power Meme: Select Success GIF** or **Power Meme: Select Error GIF** to choose a local `.gif` file. To add sound, place a `.wav` file with the same name in the same folder, for example `celebrate.gif` and `celebrate.wav`.

Run **Power Meme: Toggle Mute** to turn audio off or back on. The setting applies to the next meme and leaves GIFs enabled.

Run **Power Meme: Reset Memes** to clear both custom paths and restore the bundled GIF. Power Meme plays one meme at a time. Audio playback uses PowerShell on Windows, `afplay` on macOS, and `paplay` or `aplay` on Linux.

### Settings

| Setting | Default | Description |
| --- | --- | --- |
| `powerMeme.enabled` | `true` | Enable automatic reactions to terminal commands. |
| `powerMeme.muted` | `false` | Mute meme audio while still showing GIFs. |
| `powerMeme.playOnSuccess` | `true` | Show a GIF when a supported command succeeds. |
| `powerMeme.playOnError` | `false` | Show a GIF when a supported command fails. |
| `powerMeme.successGifPath` | Empty | Path to a custom success GIF. |
| `powerMeme.errorGifPath` | Empty | Path to a custom error GIF. |

## Supported commands

| Tool or runtime | Detected command prefixes |
| --- | --- |
| JavaScript and TypeScript | `node`, `tsx`, `npm run`, `npm start`, `npm test`, `npx`, `pnpm`, `yarn`, `bun`, `deno run` |
| Python | `python`, `python3`, `py` |
| Java | `java` |
| .NET | `dotnet run`, `dotnet test` |
| Rust | `cargo run`, `cargo test` |
| Go | `go run`, `go test` |
| PHP, Ruby, and Perl | `php`, `ruby`, `perl` |

Long-running commands such as `npm run dev`, `npm run start`, `tsx watch`, `vite`, and `nodemon` can trigger a reaction during startup.

## Development

From the repository root, install dependencies, compile, and open the project in VS Code.

```bash
npm ci
npm run compile
code .
```

Press **F5** to launch the Extension Development Host and follow the quick start in that window. After compiling, run `npx vsce package` to build a local `.vsix`.

### Project structure

- `src/extension.ts` registers commands and listens for terminal events.
- `src/commandDetector.ts` matches supported terminal commands.
- `src/editorMemePlayer.ts` displays GIFs in the editor.
- `src/audioPlayer.ts` handles WAV playback.
- `overlay/assets/` contains the bundled media.

## License

[MIT](https://github.com/Alvorak/vscode-power-meme/blob/main/LICENSE.md)
