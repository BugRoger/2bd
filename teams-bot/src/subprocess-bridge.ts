import { spawn, ChildProcess } from "child_process";
import { Config } from "./config";

export interface SubprocessCallbacks {
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
  onExit?: (code: number | null) => void;
}

/**
 * SubprocessBridge - Spawns Claude CLI processes and manages their stdio streams
 *
 * NOTE: This class is designed for single-use. Each instance should spawn one process.
 * Create a new instance for each skill execution to avoid event listener memory leaks.
 *
 * Responsibilities:
 * - Spawn Claude CLI as child process with proper arguments
 * - Set working directory to engine path
 * - Configure stdio pipes (stdin, stdout, stderr)
 * - Provide callbacks for output, error, and exit events
 * - Resolve skill paths (ritual vs command directories)
 * - Provide helper methods to send input and kill processes
 */
export class SubprocessBridge {
  private process: ChildProcess | null = null;
  private config: Config;
  private discoveredSkills: { rituals: string[]; commands: string[] } | null =
    null;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Discover available skills by scanning directories (cached)
   */
  private getDiscoveredSkills(): { rituals: string[]; commands: string[] } {
    if (!this.discoveredSkills) {
      const { discoverSkills } = require("./config");
      this.discoveredSkills = discoverSkills(this.config.enginePath);
    }
    return this.discoveredSkills;
  }

  /**
   * Resolve skill path based on type (ritual or command)
   * Uses discovered skills for validation and proper resolution
   */
  private resolveSkillPath(skillName: string): string {
    const skills = this.getDiscoveredSkills();

    // Check if skill exists in rituals
    if (skills.rituals.includes(skillName)) {
      return `rituals/${skillName}`;
    }

    // Check if skill exists in commands
    if (skills.commands.includes(skillName)) {
      return `commands/${skillName}`;
    }

    // Fallback to heuristic for backward compatibility
    // (in case discoverSkills is stale or skill was just added)
    if (skillName.startsWith("planning-") || skillName.startsWith("review-")) {
      return `rituals/${skillName}`;
    }

    // Default to commands
    return `commands/${skillName}`;
  }

  /**
   * Spawn Claude CLI process for a skill
   *
   * @param skillName - Name of the skill (e.g., "planning-daily", "init")
   * @param args - Optional arguments to pass to the skill (string or array of strings)
   * @param callbacks - Callbacks for stdout, stderr, and exit events
   * @throws {Error} If spawn fails or process cannot be started
   */
  spawn(
    skillName: string,
    args: string | string[] = "",
    callbacks: SubprocessCallbacks = {}
  ): ChildProcess {
    const skillPath = this.resolveSkillPath(skillName);

    // Build command arguments
    const cmdArgs = ["skill", "run", skillPath];
    if (args) {
      if (Array.isArray(args)) {
        // Handle array of arguments
        if (args.length > 0) {
          cmdArgs.push("--args", ...args);
        }
      } else {
        // Handle single string argument
        cmdArgs.push("--args", args);
      }
    }

    // Spawn the process with error handling
    try {
      this.process = spawn(this.config.claudeCliPath, cmdArgs, {
        cwd: this.config.enginePath,
        stdio: ["pipe", "pipe", "pipe"], // stdin, stdout, stderr
        shell: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const spawnError = new Error(
        `Failed to spawn Claude CLI process: ${errorMessage}`
      );

      // Invoke exit callback with error code if provided
      if (callbacks.onExit) {
        callbacks.onExit(-1);
      }

      throw spawnError;
    }

    // Validate that process started successfully
    if (!this.process || !this.process.pid) {
      const validationError = new Error(
        `Process failed to start: no PID assigned for skill "${skillName}"`
      );

      // Invoke exit callback with error code
      if (callbacks.onExit) {
        callbacks.onExit(-1);
      }

      throw validationError;
    }

    // Set up stdout handler
    if (this.process.stdout && callbacks.onStdout) {
      this.process.stdout.on("data", (data: Buffer) => {
        callbacks.onStdout!(data.toString());
      });
    }

    // Set up stderr handler
    if (this.process.stderr && callbacks.onStderr) {
      this.process.stderr.on("data", (data: Buffer) => {
        callbacks.onStderr!(data.toString());
      });
    }

    // Set up exit handler
    if (callbacks.onExit) {
      this.process.on("exit", (code: number | null) => {
        callbacks.onExit!(code);
        this.process = null;
      });
    }

    // Set up error handler for spawn errors that occur after initial spawn
    this.process.on("error", (error: Error) => {
      if (callbacks.onStderr) {
        callbacks.onStderr(`Process error: ${error.message}\n`);
      }
      if (callbacks.onExit) {
        callbacks.onExit(-1);
      }
      this.process = null;
    });

    return this.process;
  }

  /**
   * Send input to the spawned process's stdin
   *
   * @param input - The input string to send
   * @throws {Error} If process is not running or stdin is not available
   */
  sendInput(input: string): void {
    if (!this.process) {
      throw new Error("Cannot send input: no process is running");
    }

    if (!this.process.stdin) {
      throw new Error("Cannot send input: stdin is not available");
    }

    if (!this.isRunning()) {
      throw new Error("Cannot send input: process is not running");
    }

    if (!this.process.stdin.writable) {
      throw new Error("Cannot send input: stdin is not writable");
    }

    this.process.stdin.write(input + "\n");
  }

  /**
   * Kill the spawned process
   */
  kill(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  /**
   * Check if a process is currently running
   */
  isRunning(): boolean {
    return this.process !== null && !this.process.killed;
  }
}
