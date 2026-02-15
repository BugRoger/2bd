import Anthropic from "@anthropic-ai/sdk";
import type { SkillList } from "./config";

export interface IntentResult {
  skill: string | null;
  args?: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const DEFAULT_MODEL = "claude-3-5-haiku-20241022";

export class IntentDetector {
  private client: Anthropic;
  private systemPrompt: string;
  private model: string;

  constructor(apiKey: string, skills: SkillList, model: string = DEFAULT_MODEL) {
    this.client = new Anthropic({ apiKey });
    this.systemPrompt = this.buildSystemPrompt(skills);
    this.model = model;
  }

  private buildSystemPrompt(skills: SkillList): string {
    return `You are a 2bd ritual assistant. Given user input, determine if they want to run a ritual or command.

Available rituals: ${skills.rituals.join(", ")}
Available commands: ${skills.commands.join(", ")}

Respond with JSON only: {"skill": "skill-name", "args": "optional args"} or {"skill": null} if not a skill request.

Examples:
- "plan my day" → {"skill": "planning-daily"}
- "start weekly review" → {"skill": "review-weekly"}
- "create project called Launch" → {"skill": "create-project", "args": "Launch"}
- "how are you?" → {"skill": null}

Only return JSON, no other text.`;
  }

  private validateIntentResult(obj: unknown): IntentResult {
    if (typeof obj !== "object" || obj === null) {
      throw new Error("Invalid intent result: not an object");
    }

    const result = obj as Record<string, unknown>;

    // Validate skill field exists and is string | null
    if (!("skill" in result)) {
      throw new Error("Invalid intent result: missing 'skill' field");
    }

    if (result.skill !== null && typeof result.skill !== "string") {
      throw new Error(
        "Invalid intent result: 'skill' must be string or null"
      );
    }

    // Validate args field if present
    if ("args" in result && result.args !== undefined) {
      if (typeof result.args !== "string") {
        throw new Error("Invalid intent result: 'args' must be a string");
      }
    }

    return {
      skill: result.skill as string | null,
      args: result.args as string | undefined,
    };
  }

  async detectIntent(message: string): Promise<IntentResult> {
    // Validate message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      console.error(
        `Intent detection error: Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
      );
      return { skill: null };
    }

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 200,
        system: this.systemPrompt,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        console.error("Intent detection error: Response content is not text");
        return { skill: null };
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(content.text);
      } catch (parseErr) {
        console.error(
          "Intent detection error: Failed to parse JSON response:",
          parseErr
        );
        return { skill: null };
      }

      try {
        return this.validateIntentResult(parsed);
      } catch (validationErr) {
        console.error(
          "Intent detection error: Invalid response structure:",
          validationErr instanceof Error ? validationErr.message : validationErr
        );
        return { skill: null };
      }
    } catch (err) {
      console.error(
        "Intent detection error: API request failed:",
        err instanceof Error ? err.message : err
      );
      return { skill: null };
    }
  }
}
