// Microsoft Teams Bot Activity Types

export interface Activity {
  type: ActivityType;
  id: string;
  timestamp: string;
  localTimestamp?: string;
  serviceUrl: string;
  channelId: "msteams";
  from: ChannelAccount;
  conversation: ConversationAccount;
  recipient: ChannelAccount;
  text?: string;
  textFormat?: string;
  attachments?: Attachment[];
  entities?: Entity[];
  channelData?: TeamsChannelData;
  replyToId?: string;
  value?: unknown;
  name?: string;
}

export type ActivityType =
  | "message"
  | "conversationUpdate"
  | "messageReaction"
  | "messageUpdate"
  | "messageDelete"
  | "installationUpdate"
  | "invoke"
  | "endOfConversation"
  | "event"
  | "typing";

export interface ChannelAccount {
  id: string;
  name?: string;
  aadObjectId?: string;
}

export interface ConversationAccount {
  id: string;
  name?: string;
  conversationType?: "personal" | "groupChat" | "channel";
  tenantId?: string;
  isGroup?: boolean;
}

export interface Attachment {
  contentType: string;
  contentUrl?: string;
  content?: unknown;
  name?: string;
  thumbnailUrl?: string;
}

export interface Entity {
  type: string;
  [key: string]: unknown;
}

export interface TeamsChannelData {
  tenant?: { id: string };
  team?: { id: string; name?: string };
  channel?: { id: string; name?: string };
  meeting?: { id: string };
}

// Outgoing activity for responses
export interface OutgoingActivity {
  type: "message";
  from: ChannelAccount;
  recipient: ChannelAccount;
  conversation: { id: string };
  text?: string;
  attachments?: Attachment[];
  textFormat?: "plain" | "markdown";
}
