# Power Meme

Power Meme is a Visual Studio Code extension that plays a short video overlay when a code execution finishes.

The extension listens to terminal executions and can react differently depending on whether the command succeeds or fails.

## Features

- Detects code executions from the VS Code terminal.
- Plays a video when execution finishes successfully.
- Optionally plays a video when execution fails.
- Custom volume.
- Custom video path for success.
- Custom video path for errors.
- Prevents multiple meme overlays from playing at the same time.
- Supports several common runtimes and package managers.

## Supported commands

Current detection includes commands such as:

- Node.js
- npm
- npx
- pnpm
- yarn
- Bun
- Deno
- Python
- Java
- .NET
- Rust
- Go
- PHP
- Ruby
- Perl

Support is based on terminal command detection and will be improved over time.

## Settings

Power Meme currently provides the following settings:

- `Power Meme: Enabled`
- `Power Meme: Volume`
- `Power Meme: Play On Success`
- `Power Meme: Play On Error`
- `Power Meme: Success Video Path`
- `Power Meme: Error Video Path`

If no custom video path is configured, the extension uses the default local video.

## Development

Install dependencies:

```bash
npm install
```

Compile the extension:

```bash
npm run compile
```

Open the project in VS Code:

```bash
code .
```

Press `F5` to launch the Extension Development Host.

You can test a successful execution with:

```bash
node -e "console.log('hello')"
```

And an execution error with:

```bash
node -e "process.exit(1)"
```

## Project structure

```text
vscode-power-meme/
├── .vscode/
├── overlay/
│   ├── assets/
│   ├── index.html
│   └── main.js
├── src/
│   ├── commandDetector.ts
│   ├── extension.ts
│   └── memePlayer.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Status

The project is currently under development.

Planned improvements include:

- Video selection from VS Code commands.
- Better command detection.
- Improved error handling.
- More overlay customization.
- Packaging as a VSIX.
- Publishing to the Visual Studio Code Marketplace.

## License

This project will be released under the MIT License.