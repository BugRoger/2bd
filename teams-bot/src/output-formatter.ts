/**
 * OutputFormatter - Parses and classifies Claude CLI output for Teams display
 *
 * Responsibilities:
 * - Strip ANSI color codes from terminal output
 * - Buffer output until complete messages are received
 * - Classify output into types (PROMPT, STATUS, CONTENT, ERROR)
 * - Detect prompts (questions ending with ?)
 * - Detect status messages (emoji prefixes, "Loading...", etc.)
 * - Support flushing remaining buffered content
 */

export enum OutputType {
  PROMPT = "PROMPT",
  STATUS = "STATUS",
  CONTENT = "CONTENT",
  ERROR = "ERROR",
}

export interface ParsedOutput {
  type: OutputType;
  text: string;
}

export class OutputFormatter {
  private buffer: string = "";

  /**
   * Parse raw output from Claude CLI
   *
   * @param data - Raw output string (may contain ANSI codes)
   * @returns Array of parsed outputs (buffer is retained for incomplete lines)
   */
  parse(data: string): ParsedOutput[] {
    // Strip ANSI codes and add to buffer
    const cleaned = this.stripAnsiCodes(data);
    this.buffer += cleaned;

    // Split on newlines but keep incomplete last line in buffer
    const lines = this.buffer.split("\n");
    const results: ParsedOutput[] = [];

    // Process all complete lines (all but last)
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        results.push({
          type: this.classify(line),
          text: line,
        });
      }
    }

    // Keep last line in buffer (might be incomplete)
    this.buffer = lines[lines.length - 1];

    return results;
  }

  /**
   * Flush remaining buffered content
   *
   * @returns Parsed output for any remaining buffer content, or null if empty
   */
  flush(): ParsedOutput | null {
    if (!this.buffer.trim()) {
      this.buffer = "";
      return null;
    }

    const result: ParsedOutput = {
      type: this.classify(this.buffer.trim()),
      text: this.buffer.trim(),
    };

    this.buffer = "";
    return result;
  }

  /**
   * Strip ANSI color codes from text
   */
  private stripAnsiCodes(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replace(/\x1B\[[0-9;]*[mGKHF]/g, "");
  }

  /**
   * Classify output line into type
   */
  private classify(line: string): OutputType {
    // Check for prompts (ends with ?)
    if (line.endsWith("?")) {
      return OutputType.PROMPT;
    }

    // Check for status indicators
    const statusPatterns = [
      /^[🔄⏳⚙️📝✅❌⚠️]/u, // Emoji prefixes
      /^Loading\.\.\./,
      /^Processing\.\.\./,
      /^Starting\.\.\./,
      /^Initializing\.\.\./,
      /^\[.*\]/, // Bracketed status like [INFO], [DEBUG]
      /^\d+%/, // Percentage progress
    ];

    for (const pattern of statusPatterns) {
      if (pattern.test(line)) {
        return OutputType.STATUS;
      }
    }

    // Check for errors
    const errorPatterns = [
      /^Error:/i,
      /^Failed:/i,
      /^Warning:/i,
      /^Exception:/i,
      /^Fatal:/i,
    ];

    for (const pattern of errorPatterns) {
      if (pattern.test(line)) {
        return OutputType.ERROR;
      }
    }

    // Default to content
    return OutputType.CONTENT;
  }
}
