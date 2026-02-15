import { describe, it, expect, beforeEach } from "bun:test";
import { OutputFormatter, OutputType } from "../output-formatter";

describe("OutputFormatter", () => {
  let formatter: OutputFormatter;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  describe("ANSI code stripping", () => {
    it("should strip ANSI color codes", () => {
      const input = "\x1B[32mGreen text\x1B[0m";
      const results = formatter.parse(input + "\n");
      expect(results[0].text).toBe("Green text");
    });

    it("should strip multiple ANSI codes", () => {
      const input = "\x1B[1m\x1B[31mBold red\x1B[0m\x1B[0m";
      const results = formatter.parse(input + "\n");
      expect(results[0].text).toBe("Bold red");
    });
  });

  describe("Buffering", () => {
    it("should buffer incomplete lines", () => {
      const results1 = formatter.parse("Incomplete");
      expect(results1).toHaveLength(0);

      const results2 = formatter.parse(" line\n");
      expect(results2).toHaveLength(1);
      expect(results2[0].text).toBe("Incomplete line");
    });

    it("should process multiple complete lines", () => {
      const results = formatter.parse("Line 1\nLine 2\nLine 3\n");
      expect(results).toHaveLength(3);
      expect(results[0].text).toBe("Line 1");
      expect(results[1].text).toBe("Line 2");
      expect(results[2].text).toBe("Line 3");
    });

    it("should preserve partial line in buffer", () => {
      const results1 = formatter.parse("Line 1\nPartial");
      expect(results1).toHaveLength(1);
      expect(results1[0].text).toBe("Line 1");

      const results2 = formatter.parse(" line\n");
      expect(results2).toHaveLength(1);
      expect(results2[0].text).toBe("Partial line");
    });
  });

  describe("Flush", () => {
    it("should flush remaining buffer content", () => {
      formatter.parse("Incomplete line");
      const result = formatter.flush();
      expect(result).not.toBeNull();
      expect(result?.text).toBe("Incomplete line");
    });

    it("should return null for empty buffer", () => {
      const result = formatter.flush();
      expect(result).toBeNull();
    });

    it("should return null for whitespace-only buffer with newlines", () => {
      formatter.parse("   \n\n");
      const result = formatter.flush();
      expect(result).toBeNull();
    });

    it("should preserve whitespace-only content if no trailing newlines", () => {
      formatter.parse("   ");
      const result = formatter.flush();
      expect(result).not.toBeNull();
      expect(result?.text).toBe("   ");
    });

    it("should trim trailing newlines but preserve other whitespace", () => {
      formatter.parse("  Line with spaces  ");
      const result = formatter.flush();
      expect(result).not.toBeNull();
      expect(result?.text).toBe("  Line with spaces  ");
    });
  });

  describe("Classification - PROMPT", () => {
    it("should classify lines ending with ? as PROMPT", () => {
      const results = formatter.parse("What is your name?\n");
      expect(results[0].type).toBe(OutputType.PROMPT);
    });

    it("should classify questions with leading whitespace as PROMPT", () => {
      const results = formatter.parse("  Would you like to continue?  \n");
      expect(results[0].type).toBe(OutputType.PROMPT);
    });
  });

  describe("Classification - STATUS", () => {
    it("should classify lines with status emojis", () => {
      const emojis = ["🔄", "⏳", "⚙️", "📝", "✅", "❌", "⚠️", "⚡", "🚀", "📌", "🔔", "💡", "🎯", "🌟"];

      for (const emoji of emojis) {
        const results = formatter.parse(`${emoji} Processing...\n`);
        expect(results[0].type).toBe(OutputType.STATUS);
      }
    });

    it("should classify Loading... as STATUS", () => {
      const results = formatter.parse("Loading...\n");
      expect(results[0].type).toBe(OutputType.STATUS);
    });

    it("should classify Processing... as STATUS", () => {
      const results = formatter.parse("Processing...\n");
      expect(results[0].type).toBe(OutputType.STATUS);
    });

    it("should classify Starting... as STATUS", () => {
      const results = formatter.parse("Starting...\n");
      expect(results[0].type).toBe(OutputType.STATUS);
    });

    it("should classify Initializing... as STATUS", () => {
      const results = formatter.parse("Initializing...\n");
      expect(results[0].type).toBe(OutputType.STATUS);
    });

    it("should classify bracketed status as STATUS", () => {
      const results1 = formatter.parse("[INFO] Application started\n");
      expect(results1[0].type).toBe(OutputType.STATUS);

      const results2 = formatter.parse("[DEBUG] Processing request\n");
      expect(results2[0].type).toBe(OutputType.STATUS);
    });

    it("should classify percentage progress as STATUS", () => {
      const results1 = formatter.parse("45% complete\n");
      expect(results1[0].type).toBe(OutputType.STATUS);

      const results2 = formatter.parse("100% done\n");
      expect(results2[0].type).toBe(OutputType.STATUS);
    });

    it("should NOT classify mid-line status indicators", () => {
      // This documents the prefix-only limitation
      const results = formatter.parse("Some text Loading... more text\n");
      expect(results[0].type).toBe(OutputType.CONTENT);
    });
  });

  describe("Classification - WARNING", () => {
    it("should classify Warning: as WARNING", () => {
      const results = formatter.parse("Warning: Deprecated feature\n");
      expect(results[0].type).toBe(OutputType.WARNING);
    });

    it("should classify warning: (lowercase) as WARNING", () => {
      const results = formatter.parse("warning: This may cause issues\n");
      expect(results[0].type).toBe(OutputType.WARNING);
    });

    it("should NOT classify mid-line warnings", () => {
      // This documents the prefix-only limitation
      const results = formatter.parse("Some text Warning: issue here\n");
      expect(results[0].type).toBe(OutputType.CONTENT);
    });
  });

  describe("Classification - ERROR", () => {
    it("should classify Error: as ERROR", () => {
      const results = formatter.parse("Error: File not found\n");
      expect(results[0].type).toBe(OutputType.ERROR);
    });

    it("should classify Failed: as ERROR", () => {
      const results = formatter.parse("Failed: Connection timeout\n");
      expect(results[0].type).toBe(OutputType.ERROR);
    });

    it("should classify Exception: as ERROR", () => {
      const results = formatter.parse("Exception: Null pointer\n");
      expect(results[0].type).toBe(OutputType.ERROR);
    });

    it("should classify Fatal: as ERROR", () => {
      const results = formatter.parse("Fatal: System crash\n");
      expect(results[0].type).toBe(OutputType.ERROR);
    });

    it("should classify error: (lowercase) as ERROR", () => {
      const results = formatter.parse("error: something went wrong\n");
      expect(results[0].type).toBe(OutputType.ERROR);
    });

    it("should NOT classify mid-line errors", () => {
      // This documents the prefix-only limitation
      const results = formatter.parse("Some text Error: issue here\n");
      expect(results[0].type).toBe(OutputType.CONTENT);
    });
  });

  describe("Classification - CONTENT", () => {
    it("should classify regular text as CONTENT", () => {
      const results = formatter.parse("This is regular output\n");
      expect(results[0].type).toBe(OutputType.CONTENT);
    });

    it("should classify multi-word text as CONTENT", () => {
      const results = formatter.parse("Here is some normal output from the CLI\n");
      expect(results[0].type).toBe(OutputType.CONTENT);
    });
  });

  describe("Whitespace preservation", () => {
    it("should preserve leading whitespace in output", () => {
      const results = formatter.parse("    Indented line\n");
      expect(results[0].text).toBe("    Indented line");
    });

    it("should preserve trailing whitespace in output", () => {
      const results = formatter.parse("Line with trailing spaces    \n");
      expect(results[0].text).toBe("Line with trailing spaces    ");
    });

    it("should preserve internal whitespace", () => {
      const results = formatter.parse("Word    with    spaces\n");
      expect(results[0].text).toBe("Word    with    spaces");
    });

    it("should skip only completely empty lines", () => {
      const results = formatter.parse("Line 1\n\nLine 3\n");
      expect(results).toHaveLength(2);
      expect(results[0].text).toBe("Line 1");
      expect(results[1].text).toBe("Line 3");
    });

    it("should NOT skip lines with only whitespace", () => {
      const results = formatter.parse("Line 1\n    \nLine 3\n");
      expect(results).toHaveLength(3);
      expect(results[0].text).toBe("Line 1");
      expect(results[1].text).toBe("    ");
      expect(results[2].text).toBe("Line 3");
    });
  });

  describe("Integration tests", () => {
    it("should handle mixed output types", () => {
      const input = "🚀 Starting process\nProcessing file 1\nWarning: Large file detected\nProcessed successfully\nWould you like to continue?\n";
      const results = formatter.parse(input);

      expect(results).toHaveLength(5);
      expect(results[0].type).toBe(OutputType.STATUS);
      expect(results[1].type).toBe(OutputType.CONTENT);
      expect(results[2].type).toBe(OutputType.WARNING);
      expect(results[3].type).toBe(OutputType.CONTENT);
      expect(results[4].type).toBe(OutputType.PROMPT);
    });

    it("should handle ANSI codes with buffering", () => {
      const results1 = formatter.parse("\x1B[32mGreen ");
      expect(results1).toHaveLength(0);

      const results2 = formatter.parse("text\x1B[0m\n");
      expect(results2).toHaveLength(1);
      expect(results2[0].text).toBe("Green text");
    });

    it("should handle flush after processing multiple lines", () => {
      const results = formatter.parse("Line 1\nLine 2\nIncomplete");
      expect(results).toHaveLength(2);

      const flushed = formatter.flush();
      expect(flushed).not.toBeNull();
      expect(flushed?.text).toBe("Incomplete");
    });
  });
});
