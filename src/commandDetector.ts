const executionPatterns: RegExp[] = [
  // JavaScript / TypeScript
  /^node\b/i,
  /^npm\s+(run|start|test)\b/i,
  /^npx\b/i,
  /^pnpm\b/i,
  /^yarn\b/i,
  /^bun\b/i,
  /^deno\s+run\b/i,

  // Python
  /^python\b/i,
  /^python3\b/i,
  /^py\b/i,

  // Java
  /^java\b/i,

  // .NET
  /^dotnet\s+run\b/i,
  /^dotnet\s+test\b/i,

  // Rust
  /^cargo\s+run\b/i,
  /^cargo\s+test\b/i,

  // Go
  /^go\s+run\b/i,
  /^go\s+test\b/i,

  // PHP / Ruby / Perl
  /^php\b/i,
  /^ruby\b/i,
  /^perl\b/i,
];

export function isCodeExecution(command: string): boolean {
  const normalizedCommand = command.trim();

  if (!normalizedCommand) {
    return false;
  }

  return executionPatterns.some((pattern) =>
    pattern.test(normalizedCommand),
  );
}