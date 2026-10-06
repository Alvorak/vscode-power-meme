const executionPatterns: RegExp[] = [
    /^node\b/i,
    /^npm run\b/i,
    /^npm start\b/i,
    /^npm test\b/i,
    /^npx\b/i,
    /^pnpm\b/i,
    /^yarn\b/i,
    /^bun\b/i,

    /^python\b/i,
    /^python3\b/i,
    /^py\b/i,

    /^java\b/i,
    /^javac\b/i,

    /^dotnet run\b/i,

    /^cargo run\b/i,

    /^go run\b/i,

    /^php\b/i,

    /^ruby\b/i,

    /^perl\b/i,

    /^deno run\b/i
];

export function isCodeExecution(command: string): boolean {
    const trimmedCommand = command.trim();

    return executionPatterns.some((pattern) =>
        pattern.test(trimmedCommand)
    );
}