# Question Ordering

Intelligently order questions from all assistants for natural conversation flow.

## Ordering Heuristics

1. **Context-setting first**: journal questions (energy, mindset)
2. **Strategic next**: goals questions (priorities, focus)
3. **Tactical after**: calendar questions (meeting prep, schedule)
4. **Execution details**: projects questions (tasks, blockers)
5. **Relationships**: touchpoint planning
6. **Capture last**: achievements questions (wins to log)

## Algorithm

1. Group questions by assistant
2. Assign priority to each assistant based on heuristic
3. Within each assistant, preserve question order from draft
4. Flatten to single ordered list

## Example

Input:
```
{
  "goals-priority": "Top priority?",
  "journal-energy": "Energy level?",
  "calendar-prep": "Meeting prep?",
  "journal-mindset": "Mindset?"
}
```

Output (ordered):
```
[
  "journal-energy",
  "journal-mindset",
  "goals-priority",
  "calendar-prep"
]
```

## Context Enrichment

When asking each question, provide context from draft:
- Show relevant analysis from assistant
- Reference related information
- Make question conversational, not robotic

Example:
"Your calendar shows 3 meetings today with 4 hours of focus time. Which meeting needs the most preparation?"
