import { getAccessToken } from "./auth";
import type { OutgoingActivity } from "./types";

/**
 * Send an activity (message) to a Teams conversation
 */
export async function sendActivity(
  serviceUrl: string,
  conversationId: string,
  activity: OutgoingActivity
): Promise<void> {
  const token = await getAccessToken();

  // Normalize service URL (remove trailing slash)
  const baseUrl = serviceUrl.replace(/\/$/, "");

  const url = `${baseUrl}/v3/conversations/${encodeURIComponent(conversationId)}/activities`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to send activity: ${response.status} ${error}`);
    throw new Error(`Failed to send activity: ${response.status}`);
  }

  const result = await response.json();
  console.log(`Activity sent successfully, id: ${(result as any).id}`);
}

/**
 * Send a reply to a specific activity
 */
export async function replyToActivity(
  serviceUrl: string,
  conversationId: string,
  activityId: string,
  activity: OutgoingActivity
): Promise<void> {
  const token = await getAccessToken();

  const baseUrl = serviceUrl.replace(/\/$/, "");
  const url = `${baseUrl}/v3/conversations/${encodeURIComponent(conversationId)}/activities/${encodeURIComponent(activityId)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to reply to activity: ${response.status} ${error}`);
    throw new Error(`Failed to reply to activity: ${response.status}`);
  }
}

/**
 * Update an existing activity (edit a message)
 */
export async function updateActivity(
  serviceUrl: string,
  conversationId: string,
  activityId: string,
  activity: OutgoingActivity
): Promise<void> {
  const token = await getAccessToken();

  const baseUrl = serviceUrl.replace(/\/$/, "");
  const url = `${baseUrl}/v3/conversations/${encodeURIComponent(conversationId)}/activities/${encodeURIComponent(activityId)}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...activity,
      id: activityId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to update activity: ${response.status} ${error}`);
    throw new Error(`Failed to update activity: ${response.status}`);
  }
}

/**
 * Delete an activity (delete a message)
 */
export async function deleteActivity(
  serviceUrl: string,
  conversationId: string,
  activityId: string
): Promise<void> {
  const token = await getAccessToken();

  const baseUrl = serviceUrl.replace(/\/$/, "");
  const url = `${baseUrl}/v3/conversations/${encodeURIComponent(conversationId)}/activities/${encodeURIComponent(activityId)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to delete activity: ${response.status} ${error}`);
    throw new Error(`Failed to delete activity: ${response.status}`);
  }
}

/**
 * Send typing indicator
 */
export async function sendTypingIndicator(
  serviceUrl: string,
  conversationId: string,
  from: { id: string; name?: string },
  recipient: { id: string; name?: string }
): Promise<void> {
  const token = await getAccessToken();

  const baseUrl = serviceUrl.replace(/\/$/, "");
  const url = `${baseUrl}/v3/conversations/${encodeURIComponent(conversationId)}/activities`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "typing",
      from,
      recipient,
      conversation: { id: conversationId },
    }),
  });

  if (!response.ok) {
    console.warn(`Failed to send typing indicator: ${response.status}`);
  }
}
