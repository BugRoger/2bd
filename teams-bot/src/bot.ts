import { sendActivity } from "./teams-api";
import type { Activity, OutgoingActivity } from "./types";
import { getComponents } from "./components";
import { OutputType } from "./output-formatter";

/**
 * Allowed users by Azure AD Object ID
 * Only these users can interact with the bot
 */
const ALLOWED_USERS: string[] = [
  process.env.ALLOWED_AAD_OBJECT_ID || "",
].filter(Boolean);

/**
 * Check if a user is authorized to use the bot
 */
function isAuthorizedUser(aadObjectId: string | undefined): boolean {
  if (!aadObjectId) return false;
  if (ALLOWED_USERS.length === 0) {
    console.warn("⚠️ No ALLOWED_AAD_OBJECT_ID configured - allowing all users");
    return true;
  }
  return ALLOWED_USERS.includes(aadObjectId);
}

/**
 * Main activity handler - processes incoming activities from Teams
 */
export async function handleActivity(activity: Activity): Promise<void> {
  switch (activity.type) {
    case "message":
      await handleMessage(activity);
      break;

    case "conversationUpdate":
      await handleConversationUpdate(activity);
      break;

    case "invoke":
      await handleInvoke(activity);
      break;

    default:
      console.log(`Unhandled activity type: ${activity.type}`);
  }
}

/**
 * Handle incoming messages
 */
async function handleMessage(activity: Activity): Promise<void> {
  const text = activity.text?.trim() || "";
  const userName = activity.from?.name || "User";
  const aadObjectId = activity.from?.aadObjectId;
  const conversationId = activity.conversation.id;

  console.log(`Message from ${userName} (${aadObjectId || "no-aad-id"}): ${text}`);

  // Check authorization
  if (!isAuthorizedUser(aadObjectId)) {
    console.log(`Unauthorized user: ${userName} (${aadObjectId})`);
    await sendReply(
      activity,
      "Sorry, this bot is private and not available for general use."
    );
    return;
  }

  // Remove bot mention from message if present
  const cleanedText = removeBotMention(text, activity);

  // Handle meta commands
  if (cleanedText.toLowerCase() === "cancel") {
    await handleCancel(activity);
    return;
  }

  if (cleanedText.toLowerCase() === "status") {
    await handleStatus(activity);
    return;
  }

  if (cleanedText.toLowerCase() === "help") {
    await handleHelp(activity);
    return;
  }

  // Check if there's an active session
  const { sessionManager, intentDetector } = getComponents();
  const activeSession = sessionManager.getActiveSession();

  if (activeSession) {
    // Route message to active session
    if (activeSession.conversationId === conversationId) {
      await handleActiveSessionMessage(activity, cleanedText);
    } else {
      await sendReply(
        activity,
        `Active ${activeSession.skill} session in progress in another conversation. Send "cancel" to stop it.`
      );
    }
    return;
  }

  // No active session - detect intent
  try {
    const intent = await intentDetector.detectIntent(cleanedText);

    if (intent.skill) {
      // Start new session
      await startSession(activity, intent.skill, intent.args);
    } else {
      // No skill detected - provide help
      await sendReply(
        activity,
        `I didn't understand that. Send "help" to see available commands.`
      );
    }
  } catch (error) {
    console.error("Error detecting intent:", error);
    await sendReply(
      activity,
      "Sorry, I encountered an error processing your request."
    );
  }
}

/**
 * Handle message when there's an active session
 */
async function handleActiveSessionMessage(
  activity: Activity,
  message: string
): Promise<void> {
  try {
    const { sessionManager, subprocessBridge } = getComponents();
    const session = sessionManager.getActiveSession();
    if (!session) {
      await sendReply(activity, "No active session found.");
      return;
    }

    // Send message to subprocess
    subprocessBridge.sendInput(message);

    // Reset session timeout
    sessionManager.resetTimeout();
  } catch (error) {
    console.error("Error sending message to subprocess:", error);
    await sendReply(activity, "Error communicating with the skill process.");
  }
}

/**
 * Start a new skill session
 */
async function startSession(
  activity: Activity,
  skill: string,
  args?: string
): Promise<void> {
  const { sessionManager, subprocessBridge } = getComponents();

  // Check if session can be started
  const blockMessage = sessionManager.checkCanStart();
  if (blockMessage) {
    await sendReply(activity, blockMessage);
    return;
  }

  try {
    await sendReply(activity, `Starting ${skill}...`);

    // Get OutputFormatter class for creating a new instance
    const { OutputFormatter } = await import("./output-formatter");
    // Create output formatter instance for this session
    const formatter = new OutputFormatter();

    // Spawn subprocess with callbacks
    const childProcess = subprocessBridge.spawn(
      skill,
      args || "",
      {
        onStdout: async (data: string) => {
          await handleSubprocessOutput(activity, data, formatter);
        },
        onStderr: async (data: string) => {
          console.error(`[${skill} stderr]:`, data);
          // Send stderr as error message
          await sendReply(activity, `Error: ${data}`);
        },
        onExit: async (code: number | null) => {
          console.log(`[${skill}] Process exited with code ${code}`);

          // Flush any remaining buffered output
          const remaining = formatter.flush();
          if (remaining) {
            await handleOutputLine(activity, remaining);
          }

          // Destroy session
          sessionManager.destroy();

          // Send completion message
          if (code === 0) {
            await sendReply(activity, `✅ ${skill} completed successfully.`);
          } else {
            await sendReply(
              activity,
              `❌ ${skill} exited with code ${code}.`
            );
          }
        },
      }
    );

    // Create session
    sessionManager.create(activity.conversation.id, skill, childProcess);

    console.log(`Session started: ${skill} in conversation ${activity.conversation.id}`);
  } catch (error) {
    console.error("Error starting session:", error);
    await sendReply(
      activity,
      `Failed to start ${skill}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Handle subprocess output
 */
async function handleSubprocessOutput(
  activity: Activity,
  data: string,
  formatter: OutputFormatter
): Promise<void> {
  const outputs = formatter.parse(data);

  for (const output of outputs) {
    await handleOutputLine(activity, output);
  }
}

/**
 * Handle a single line of parsed output
 */
async function handleOutputLine(
  activity: Activity,
  output: { type: OutputType; text: string }
): Promise<void> {
  switch (output.type) {
    case OutputType.PROMPT:
      // Try to render as adaptive card
      const { interactiveMapper } = getComponents();
      const prompt = interactiveMapper.detectPrompt(output.text);
      if (prompt) {
        const card = interactiveMapper.renderAdaptiveCard(prompt);
        await sendAdaptiveCard(activity, card);
      } else {
        // Fallback to plain text
        await sendReply(activity, output.text);
      }
      break;

    case OutputType.STATUS:
      // Send status as-is
      await sendReply(activity, output.text);
      break;

    case OutputType.WARNING:
      // Send warning with formatting
      await sendReply(activity, `⚠️ ${output.text}`);
      break;

    case OutputType.ERROR:
      // Send error with formatting
      await sendReply(activity, `❌ ${output.text}`);
      break;

    case OutputType.CONTENT:
      // Send content as-is
      await sendReply(activity, output.text);
      break;
  }
}

/**
 * Handle cancel command
 */
async function handleCancel(activity: Activity): Promise<void> {
  const { sessionManager } = getComponents();
  const session = sessionManager.getActiveSession();

  if (!session) {
    await sendReply(activity, "No active session to cancel.");
    return;
  }

  if (session.conversationId !== activity.conversation.id) {
    await sendReply(
      activity,
      "Cannot cancel - active session is in another conversation."
    );
    return;
  }

  sessionManager.destroy();
  await sendReply(activity, `Cancelled ${session.skill} session.`);
}

/**
 * Handle status command
 */
async function handleStatus(activity: Activity): Promise<void> {
  const { sessionManager } = getComponents();
  const session = sessionManager.getActiveSession();

  if (!session) {
    await sendReply(activity, "No active session.");
    return;
  }

  const duration = Date.now() - session.startedAt.getTime();
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);

  await sendReply(
    activity,
    `Active session: ${session.skill}\nDuration: ${minutes}m ${seconds}s`
  );
}

/**
 * Handle help command
 */
async function handleHelp(activity: Activity): Promise<void> {
  const helpText = `**2bd Bot Commands**

**Meta Commands:**
- **cancel** - Cancel the active session
- **status** - Show active session info
- **help** - Show this help message

**Skill Commands:**
Just describe what you want to do in natural language:
- "plan my day" - Start daily planning
- "review my day" - Start daily review
- "create project called Launch" - Create a new project
- "archive project Launch" - Archive a completed project

Send a command to get started!`;

  await sendReply(activity, helpText);
}

/**
 * Handle conversation updates (member added/removed)
 */
async function handleConversationUpdate(activity: Activity): Promise<void> {
  // Check if bot was added to the conversation
  const membersAdded = (activity as any).membersAdded as Array<{ id: string; name?: string }> | undefined;

  if (membersAdded) {
    for (const member of membersAdded) {
      // If bot was added, send welcome message
      if (member.id === activity.recipient.id) {
        const welcomeMessage = `👋 Hello! I'm your 2bd bot assistant.

I can help you with daily rituals and project management:
- **plan my day** - Start daily planning
- **review my day** - Start daily review
- **create project** - Create a new project
- **help** - Show available commands

Send a command to get started!`;

        await sendReply(activity, welcomeMessage);
        break;
      }
    }
  }
}

/**
 * Handle invoke activities (adaptive cards, message extensions, etc.)
 */
async function handleInvoke(activity: Activity): Promise<void> {
  console.log(`Invoke activity: ${activity.name}`);

  // Handle adaptive card submissions
  if (activity.name === "adaptiveCard/action") {
    await handleAdaptiveCardSubmission(activity);
    return;
  }

  console.log("Unhandled invoke type:", activity.name);
}

/**
 * Handle adaptive card submission
 */
async function handleAdaptiveCardSubmission(activity: Activity): Promise<void> {
  const { sessionManager, subprocessBridge, interactiveMapper } = getComponents();
  const session = sessionManager.getActiveSession();

  if (!session) {
    await sendReply(activity, "No active session - response ignored.");
    return;
  }

  if (session.conversationId !== activity.conversation.id) {
    await sendReply(
      activity,
      "Cannot submit - active session is in another conversation."
    );
    return;
  }

  try {
    // Parse card data
    const cardData = activity.value;
    const response = interactiveMapper.parseSubmission(cardData);

    console.log(`Adaptive card response: ${response}`);

    // Send response to subprocess
    subprocessBridge.sendInput(response);

    // Reset session timeout
    sessionManager.resetTimeout();

    // Send acknowledgment
    await sendReply(activity, `Received: ${response}`);
  } catch (error) {
    console.error("Error handling adaptive card submission:", error);
    await sendReply(activity, "Error processing your response.");
  }
}

/**
 * Remove @mention of the bot from message text
 */
function removeBotMention(text: string, activity: Activity): string {
  if (!activity.entities) return text;

  for (const entity of activity.entities) {
    if (entity.type === "mention") {
      const mention = entity as { mentioned?: { id: string }; text?: string };
      if (mention.mentioned?.id === activity.recipient.id && mention.text) {
        text = text.replace(mention.text, "").trim();
      }
    }
  }

  return text;
}

/**
 * Helper: Send a text reply
 */
async function sendReply(activity: Activity, text: string): Promise<void> {
  const reply: OutgoingActivity = {
    type: "message",
    from: activity.recipient,
    recipient: activity.from,
    conversation: { id: activity.conversation.id },
    text,
    textFormat: "markdown",
  };

  await sendActivity(activity.serviceUrl, activity.conversation.id, reply);
}

/**
 * Helper: Send an adaptive card
 */
async function sendAdaptiveCard(
  activity: Activity,
  card: any
): Promise<void> {
  const reply: OutgoingActivity = {
    type: "message",
    from: activity.recipient,
    recipient: activity.from,
    conversation: { id: activity.conversation.id },
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: card,
      },
    ],
  };

  await sendActivity(activity.serviceUrl, activity.conversation.id, reply);
}
