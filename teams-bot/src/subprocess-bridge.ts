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

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Resolve skill path based on type (ritual or command)
   */
  private resolveSkillPath(skillName: string): string {
    // Check if it's a ritual (planning-daily, review-daily, etc.)
    if (skillName.startsWith("planning-") || skillName.startsWith("review-")) {
      return `rituals/${skillName}`;
    }
    // Otherwise assume it's a command
    return `commands/${skillName}`;
  }

  /**
   * Spawn Claude CLI process for a skill
   *
   * @param skillName - Name of the skill (e.g., "planning-daily", "init")
   * @param args - Optional arguments to pass to the skill
   * @param callbacks - Callbacks for stdout, stderr, and exit events
   */
  spawn(
    skillName: string,
    args: string = "",
    callbacks: SubprocessCallbacks = {}
  ): ChildProcess {
    const skillPath = this.resolveSkillPath(skillName);

    // Build command arguments
    const cmdArgs = ["skill", "run", skillPath];
    if (args) {
      cmdArgs.push("--args", args);
    }

    // Spawn the process
    this.process = spawn(this.config.claudeCliPath, cmdArgs, {
      cwd: this.config.enginePath,
      stdio: ["pipe", "pipe", "pipe"], // stdin, stdout, stderr
      shell: false,
    });

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

    return this.process;
  }

  /**
   * Send input to the spawned process's stdin
   */
  sendInput(input: string): void {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(input + "\n");
    }
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
