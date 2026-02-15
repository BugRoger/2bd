import { existsSync, readdirSync } from "fs";
import { join } from "path";

export interface Config {
  enginePath: string;
  claudeCliPath: string;
  sessionTimeoutMs: number;
  anthropicApiKey: string;
}

export function loadConfig(): Config {
  const enginePath = process.env.ENGINE_PATH;
  if (!enginePath) {
    throw new Error("ENGINE_PATH environment variable is required");
  }

  if (!existsSync(enginePath)) {
    throw new Error(`Engine path does not exist: ${enginePath}`);
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  return {
    enginePath,
    claudeCliPath: process.env.CLAUDE_CLI_PATH || "claude",
    sessionTimeoutMs: parseInt(process.env.SESSION_TIMEOUT_MS || "1800000"),
    anthropicApiKey,
  };
}

export interface SkillList {
  rituals: string[];
  commands: string[];
}

export function discoverSkills(enginePath: string): SkillList {
  const ritualsPath = join(enginePath, ".claude/skills/rituals");
  const commandsPath = join(enginePath, ".claude/skills/commands");

  const rituals = readdirSync(ritualsPath).filter((name: string) =>
    existsSync(join(ritualsPath, name, "SKILL.md"))
  );

  const commands = readdirSync(commandsPath).filter((name: string) =>
    existsSync(join(commandsPath, name, "SKILL.md"))
  );

  return { rituals, commands };
}
