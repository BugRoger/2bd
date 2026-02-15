import { Hono } from "hono";
import { logger } from "hono/logger";
import { validateToken } from "./auth";
import { handleActivity } from "./bot";
import type { Activity } from "./types";
import { loadConfig, discoverSkills } from "./config";
import { SessionManager } from "./session-manager";
import { IntentDetector } from "./intent-detector";
import { SubprocessBridge } from "./subprocess-bridge";
import { OutputFormatter } from "./output-formatter";
import { InteractiveMapper } from "./interactive-mapper";
import { initializeComponents } from "./components";

// Initialize components
console.log("🔧 Loading configuration...");
const config = loadConfig();

console.log("🔍 Discovering skills...");
const skills = discoverSkills(config.enginePath);
console.log(`  Found ${skills.rituals.length} rituals: ${skills.rituals.join(", ")}`);
console.log(`  Found ${skills.commands.length} commands: ${skills.commands.join(", ")}`);

console.log("🔄 Initializing components...");
const sessionManager = new SessionManager(config.sessionTimeoutMs);
const intentDetector = new IntentDetector(config.anthropicApiKey, skills);
const subprocessBridge = new SubprocessBridge(config);
const outputFormatter = new OutputFormatter();
const interactiveMapper = new InteractiveMapper();

// Cleanup any orphaned sessions on startup
console.log("🧹 Cleaning up orphaned sessions...");
sessionManager.cleanupOrphaned();

// Store components for use across the application
initializeComponents({
  config,
  skills,
  sessionManager,
  intentDetector,
  subprocessBridge,
  outputFormatter,
  interactiveMapper,
});

const app = new Hono();

app.use("*", logger());

// Health check endpoint
app.get("/", (c) => c.json({ status: "ok", service: "teams-bot" }));

// Main webhook endpoint for Teams messages
app.post("/api/messages", async (c) => {
  try {
    // Get authorization header
    const authHeader = c.req.header("Authorization");

    // Validate JWT token from Azure Bot Service
    const isValid = await validateToken(authHeader);
    if (!isValid) {
      console.error("Invalid or missing authorization token");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Parse incoming activity
    const activity: Activity = await c.req.json();

    console.log(`Received activity: type=${activity.type}, from=${activity.from?.name}`);

    // Handle the activity
    await handleActivity(activity);

    // Teams expects 200 OK response
    return c.json({ status: "ok" });
  } catch (error) {
    console.error("Error processing activity:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

const port = parseInt(process.env.PORT || "3000");

console.log(`🤖 Teams bot server starting on port ${port}`);
console.log(`✅ All components initialized successfully`);

export default {
  port,
  fetch: app.fetch,
};
