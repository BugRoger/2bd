/**
 * InteractiveMapper - Converts Claude CLI prompts into Teams Adaptive Cards
 *
 * Responsibilities:
 * - Detect prompts in Claude output (questions with numbered options)
 * - Parse question text and option lists
 * - Determine prompt type (single select, multi select, text input, confirm)
 * - Generate Teams Adaptive Card JSON for the prompt
 * - Parse Adaptive Card submission data back to CLI input format
 */

export enum PromptType {
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  TEXT_INPUT = "TEXT_INPUT",
  CONFIRM = "CONFIRM",
}

export interface ParsedPrompt {
  question: string;
  type: PromptType;
  options?: string[];
}

export interface AdaptiveCard {
  type: "AdaptiveCard";
  $schema: string;
  version: string;
  body: AdaptiveCardElement[];
  actions: AdaptiveCardAction[];
}

/**
 * Adaptive Card element types used in this mapper
 * Using discriminated unions for type safety
 */
type AdaptiveCardElement =
  | TextBlockElement
  | InputChoiceSetElement
  | InputTextElement;

interface TextBlockElement {
  type: "TextBlock";
  text: string;
  wrap?: boolean;
  weight?: "Lighter" | "Default" | "Bolder";
  size?: "Small" | "Default" | "Medium" | "Large" | "ExtraLarge";
}

interface InputChoiceSetElement {
  type: "Input.ChoiceSet";
  id: string;
  style?: "compact" | "expanded";
  isMultiSelect?: boolean;
  choices: Array<{
    title: string;
    value: string;
  }>;
}

interface InputTextElement {
  type: "Input.Text";
  id: string;
  placeholder?: string;
  isMultiline?: boolean;
}

/**
 * Adaptive Card action types
 */
interface AdaptiveCardAction {
  type: "Action.Submit";
  title: string;
  data?: Record<string, any>;
}

export class InteractiveMapper {
  /**
   * Pattern to match numbered options in CLI output
   * Matches: "1. Option", "2) Option", "  3. Option" (with leading whitespace)
   * Limitation: May match indented numbered lists that aren't actual prompt options.
   * This is acceptable as the parser stops at the first non-matching line after options begin.
   */
  private static readonly OPTIONS_PATTERN = /^\s*(\d+)[.)]\s+(.+)/;

  /**
   * Detect and parse a prompt from Claude CLI output
   *
   * @param output - Output text from Claude CLI
   * @returns Parsed prompt or null if no prompt detected
   */
  detectPrompt(output: string): ParsedPrompt | null {
    const lines = output.trim().split("\n");

    // Look for question containing ?
    let questionIndex = -1;
    let question = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes("?")) {
        questionIndex = i;
        question = line;
        break;
      }
    }

    if (questionIndex === -1) {
      return null;
    }

    // Check for numbered options after the question
    const options: string[] = [];

    for (let i = questionIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(InteractiveMapper.OPTIONS_PATTERN);
      if (match) {
        options.push(match[2]);
      } else if (line.trim() && options.length > 0) {
        // Stop if we hit non-option content after finding options
        break;
      }
    }

    // Determine prompt type
    let type: PromptType;

    if (options.length === 0) {
      // No options - free text input
      type = PromptType.TEXT_INPUT;
    } else if (options.length === 2 && this.isConfirmPrompt(options)) {
      // Yes/No style confirmation
      type = PromptType.CONFIRM;
    } else if (question.toLowerCase().includes("select all") ||
               question.toLowerCase().includes("choose all") ||
               question.toLowerCase().includes("multiple")) {
      // Multi-select indicators
      type = PromptType.MULTI_SELECT;
    } else {
      // Default to single select for numbered options
      type = PromptType.SINGLE_SELECT;
    }

    return {
      question,
      type,
      options: options.length > 0 ? options : undefined,
    };
  }

  /**
   * Check if options represent a yes/no confirmation
   */
  private isConfirmPrompt(options: string[]): boolean {
    // Guard: Confirm prompts must have exactly 2 options
    if (options.length !== 2) {
      return false;
    }

    const opt1 = options[0].toLowerCase();
    const opt2 = options[1].toLowerCase();

    return (
      (opt1.includes("yes") && opt2.includes("no")) ||
      (opt1.includes("no") && opt2.includes("yes")) ||
      (opt1.includes("confirm") && opt2.includes("cancel")) ||
      (opt1.includes("ok") && opt2.includes("cancel"))
    );
  }

  /**
   * Render an Adaptive Card for a parsed prompt
   *
   * @param prompt - Parsed prompt to render
   * @returns Adaptive Card JSON
   */
  renderAdaptiveCard(prompt: ParsedPrompt): AdaptiveCard {
    const card: AdaptiveCard = {
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: prompt.question,
          wrap: true,
          weight: "Bolder",
          size: "Medium",
        },
      ],
      actions: [],
    };

    switch (prompt.type) {
      case PromptType.SINGLE_SELECT:
        if (prompt.options) {
          // Add choice set for single select
          card.body.push({
            type: "Input.ChoiceSet",
            id: "response",
            style: "compact",
            isMultiSelect: false,
            choices: prompt.options.map((opt, idx) => ({
              title: opt,
              value: String(idx + 1),
            })),
          });
        }
        card.actions.push({
          type: "Action.Submit",
          title: "Submit",
          data: { action: "submit" },
        });
        break;

      case PromptType.MULTI_SELECT:
        if (prompt.options) {
          // Add choice set for multi select
          card.body.push({
            type: "Input.ChoiceSet",
            id: "response",
            style: "expanded",
            isMultiSelect: true,
            choices: prompt.options.map((opt, idx) => ({
              title: opt,
              value: String(idx + 1),
            })),
          });
        }
        card.actions.push({
          type: "Action.Submit",
          title: "Submit",
          data: { action: "submit" },
        });
        break;

      case PromptType.TEXT_INPUT:
        // Add text input
        card.body.push({
          type: "Input.Text",
          id: "response",
          placeholder: "Enter your response...",
          isMultiline: true,
        });
        card.actions.push({
          type: "Action.Submit",
          title: "Submit",
          data: { action: "submit" },
        });
        break;

      case PromptType.CONFIRM:
        // Add two action buttons for yes/no
        // Guard: Ensure we have exactly 2 options before accessing them
        if (prompt.options && prompt.options.length === 2) {
          card.actions.push({
            type: "Action.Submit",
            title: prompt.options[0],
            data: { action: "submit", response: "1" },
          });
          card.actions.push({
            type: "Action.Submit",
            title: prompt.options[1],
            data: { action: "submit", response: "2" },
          });
        } else {
          // Fallback to default confirm buttons if options are missing or invalid
          card.actions.push({
            type: "Action.Submit",
            title: "Yes",
            data: { action: "submit", response: "1" },
          });
          card.actions.push({
            type: "Action.Submit",
            title: "No",
            data: { action: "submit", response: "2" },
          });
        }
        break;
    }

    return card;
  }

  /**
   * Parse Adaptive Card submission data back to CLI input format
   *
   * @param cardData - Data from Adaptive Card submission
   * @returns CLI input string
   */
  parseSubmission(cardData: any): string {
    // Handle confirm style (response sent at top level in action data)
    if (cardData.response) {
      return cardData.response;
    }

    // Handle input field style (response from user input)
    // Note: Input fields send their values directly in cardData, not nested under cardData.data
    const response = cardData.response;

    if (response !== undefined && response !== null) {
      // Handle multi-select (comma-separated values)
      if (Array.isArray(response)) {
        return response.join(",");
      }

      return String(response);
    }

    // Fallback to empty string
    return "";
  }
}
