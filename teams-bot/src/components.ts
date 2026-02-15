/**
 * Shared component instances for the bot
 * Initialized once at startup and shared across the application
 */

import type { Config, SkillList } from "./config";
import type { SessionManager } from "./session-manager";
import type { IntentDetector } from "./intent-detector";
import type { SubprocessBridge } from "./subprocess-bridge";
import type { OutputFormatter } from "./output-formatter";
import type { InteractiveMapper } from "./interactive-mapper";

interface Components {
  config: Config;
  skills: SkillList;
  sessionManager: SessionManager;
  intentDetector: IntentDetector;
  subprocessBridge: SubprocessBridge;
  outputFormatter: OutputFormatter;
  interactiveMapper: InteractiveMapper;
}

let components: Components | null = null;

export function initializeComponents(c: Components): void {
  if (components) {
    throw new Error("Components already initialized");
  }
  components = c;
}

export function getComponents(): Components {
  if (!components) {
    throw new Error("Components not initialized");
  }
  return components;
}
