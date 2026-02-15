import Anthropic from "@anthropic-ai/sdk";
import type { SkillList } from "./config";

export interface IntentResult {
  skill: string | null;
  args?: string;
}

export class IntentDetector {
  private client: Anthropic;
  private systemPrompt: string;

  constructor(apiKey: string, skills: SkillList) {
    this.client = new Anthropic({ apiKey });
    this.systemPrompt = this.buildSystemPrompt(skills);
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

  async detectIntent(message: string): Promise<IntentResult> {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-haiku-20241022",
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
        return { skill: null };
      }

      const result = JSON.parse(content.text);
      return result as IntentResult;
    } catch (err) {
      console.error("Intent detection error:", err);
      return { skill: null };
    }
  }
}
