import type { Session, SessionState } from "./types";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const SESSION_FILE = ".active-session.json";

export class SessionManager {
  private activeSession: Session | null = null;
  private timeoutHandle: NodeJS.Timeout | null = null;

  constructor(private timeoutMs: number = 1800000) {}

  hasActiveSession(): boolean {
    return this.activeSession !== null;
  }

  getActiveSession(): Session | null {
    return this.activeSession;
  }

  create(conversationId: string, skill: string, process: any): Session {
    if (this.activeSession) {
      throw new Error("Cannot create session: active session exists");
    }

    const session: Session = {
      conversationId,
      skill,
      process,
      startedAt: new Date(),
      lastActivity: new Date(),
    };

    this.activeSession = session;
    this.saveState();
    this.resetTimeout();

    return session;
  }

  destroy(): void {
    if (this.activeSession) {
      try {
        this.activeSession.process.kill();
      } catch (err) {
        console.error("Error killing process:", err);
      }
      this.activeSession = null;
    }

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    this.clearState();
  }

  resetTimeout(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    if (this.activeSession) {
      this.activeSession.lastActivity = new Date();

      this.timeoutHandle = setTimeout(() => {
        console.log("Session timed out due to inactivity");
        this.destroy();
      }, this.timeoutMs);
    }
  }

  checkCanStart(): string | null {
    return this.activeSession
      ? `Active ${this.activeSession.skill} session in progress. Send "cancel" to stop it.`
      : null;
  }

  private saveState(): void {
    if (!this.activeSession) return;

    const state: SessionState = {
      pid: this.activeSession.process.pid!,
      skill: this.activeSession.skill,
      conversationId: this.activeSession.conversationId,
      startedAt: this.activeSession.startedAt.toISOString(),
    };

    writeFileSync(SESSION_FILE, JSON.stringify(state, null, 2));
  }

  private clearState(): void {
    if (existsSync(SESSION_FILE)) {
      unlinkSync(SESSION_FILE);
    }
  }

  cleanupOrphaned(): void {
    if (!existsSync(SESSION_FILE)) return;

    try {
      const state: SessionState = JSON.parse(readFileSync(SESSION_FILE, "utf-8"));
      console.log(`Found orphaned session: ${state.skill} (PID: ${state.pid})`);

      try {
        process.kill(state.pid);
        console.log(`Killed orphaned process ${state.pid}`);
      } catch (err) {
        console.log(`Process ${state.pid} already dead`);
      }

      this.clearState();
    } catch (err) {
      console.error("Error cleaning up orphaned session:", err);
      this.clearState();
    }
  }
}
