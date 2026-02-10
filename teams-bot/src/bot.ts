import { sendActivity } from "./teams-api";
import type { Activity, OutgoingActivity } from "./types";

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

  console.log(`Message from ${userName} (${aadObjectId || "no-aad-id"}): ${text}`);

  // Check authorization
  if (!isAuthorizedUser(aadObjectId)) {
    console.log(`Unauthorized user: ${userName} (${aadObjectId})`);
    const reply: OutgoingActivity = {
      type: "message",
      from: activity.recipient,
      recipient: activity.from,
      conversation: { id: activity.conversation.id },
      text: "Sorry, this bot is private and not available for general use.",
      textFormat: "plain",
    };
    await sendActivity(activity.serviceUrl, activity.conversation.id, reply);
    return;
  }

  // Remove bot mention from message if present
  const cleanedText = removeBotMention(text, activity);

  // Simple echo bot - replace with your logic
  let responseText: string;

  if (cleanedText.toLowerCase() === "hello" || cleanedText.toLowerCase() === "hi") {
    responseText = `Hello ${userName}! 👋 I'm your Teams bot. How can I help you?`;
  } else if (cleanedText.toLowerCase() === "help") {
    responseText = `Here's what I can do:
- **hello** - Greet you
- **help** - Show this help message
- **echo [text]** - Echo back your message
- Or just send any message and I'll echo it back!`;
  } else if (cleanedText.toLowerCase().startsWith("echo ")) {
    responseText = cleanedText.substring(5);
  } else {
    responseText = `You said: "${cleanedText}"`;
  }

  // Send reply
  const reply: OutgoingActivity = {
    type: "message",
    from: activity.recipient,
    recipient: activity.from,
    conversation: { id: activity.conversation.id },
    text: responseText,
    textFormat: "markdown",
  };

  await sendActivity(activity.serviceUrl, activity.conversation.id, reply);
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
        const welcomeMessage: OutgoingActivity = {
          type: "message",
          from: activity.recipient,
          recipient: activity.from,
          conversation: { id: activity.conversation.id },
          text: `👋 Hello! I'm your Teams bot. Send me a message to get started!\n\nType **help** to see what I can do.`,
          textFormat: "markdown",
        };

        await sendActivity(
          activity.serviceUrl,
          activity.conversation.id,
          welcomeMessage
        );
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
  // Handle specific invoke types as needed
  // e.g., adaptive card actions, message extensions
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
