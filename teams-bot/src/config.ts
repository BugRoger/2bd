import { existsSync, readdirSync } from "fs";
import { join } from "path";

export interface Config {
  enginePath: string;
  claudeCliPath: string;
  sessionTimeoutMs: number;
  anthropicApiKey: string;
}

/**
 * Loads and validates configuration from environment variables.
 *
 * @returns {Config} Validated configuration object
 * @throws {Error} If required environment variables are missing or invalid
 */
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

  // Validate API key format
  if (!anthropicApiKey.startsWith("sk-ant-")) {
    throw new Error("ANTHROPIC_API_KEY must start with 'sk-ant-'");
  }

  // Parse and validate session timeout
  const timeoutStr = process.env.SESSION_TIMEOUT_MS || "1800000";
  const sessionTimeoutMs = parseInt(timeoutStr, 10);

  if (isNaN(sessionTimeoutMs)) {
    throw new Error(
      `SESSION_TIMEOUT_MS must be a valid number, got: ${timeoutStr}`
    );
  }

  // Validate timeout bounds (must be positive and less than 24 hours)
  const MAX_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
  if (sessionTimeoutMs <= 0) {
    throw new Error(
      `SESSION_TIMEOUT_MS must be greater than 0, got: ${sessionTimeoutMs}`
    );
  }
  if (sessionTimeoutMs > MAX_TIMEOUT_MS) {
    throw new Error(
      `SESSION_TIMEOUT_MS must be less than 24 hours (${MAX_TIMEOUT_MS}ms), got: ${sessionTimeoutMs}`
    );
  }

  return {
    enginePath,
    claudeCliPath: process.env.CLAUDE_CLI_PATH || "claude",
    sessionTimeoutMs,
    anthropicApiKey,
  };
}

export interface SkillList {
  rituals: string[];
  commands: string[];
}

/**
 * Discovers available skills by scanning the rituals and commands directories.
 *
 * @param {string} enginePath - Path to the 2bd engine directory
 * @returns {SkillList} Object containing arrays of ritual and command skill names
 * @throws {Error} If skill directories don't exist or cannot be read
 */
export function discoverSkills(enginePath: string): SkillList {
  const ritualsPath = join(enginePath, ".claude/skills/rituals");
  const commandsPath = join(enginePath, ".claude/skills/commands");

  let rituals: string[] = [];
  let commands: string[] = [];

  // Try to read rituals directory
  try {
    if (!existsSync(ritualsPath)) {
      throw new Error(`Rituals directory does not exist: ${ritualsPath}`);
    }
    rituals = readdirSync(ritualsPath).filter((name: string) =>
      existsSync(join(ritualsPath, name, "SKILL.md"))
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to discover rituals: ${error.message}`);
    }
    throw error;
  }

  // Try to read commands directory
  try {
    if (!existsSync(commandsPath)) {
      throw new Error(`Commands directory does not exist: ${commandsPath}`);
    }
    commands = readdirSync(commandsPath).filter((name: string) =>
      existsSync(join(commandsPath, name, "SKILL.md"))
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to discover commands: ${error.message}`);
    }
    throw error;
  }

  return { rituals, commands };
}
