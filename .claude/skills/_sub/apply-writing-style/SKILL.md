---
name: apply-writing-style
description: Polish prose before writing to files. Receives draft text, returns concise version applying Strunk's principles.
disable-model-invocation: false
---

# Apply Writing Style

Copyedit prose to read like skilled human writing, not typical AI output.

## Input

Draft prose passed in the prompt.

## Output

Polished prose. No explanations, just the edited text.

## Core Rules (Strunk)

### Use Active Voice

Put the actor before the action.

| Weak | Strong |
|------|--------|
| The project was completed by the team | The team completed the project |
| It was decided that | We decided |
| There were many issues found | We found many issues |

### Omit Needless Words

Every word earns its place.

| Cut | Keep |
|-----|------|
| the question as to whether | whether |
| owing to the fact that | because |
| in a hasty manner | hastily |
| he is a man who | he |
| this is a subject which | this subject |

### Cut Qualifiers and Hedges

| Remove |
|--------|
| very, really, quite, somewhat, rather, fairly |
| I think, it seems, perhaps, maybe, arguably |
| actually, basically, essentially, literally, honestly |

### Use Positive Form

Say what is, not what isn't.

| Weak | Strong |
|------|--------|
| He was not very often on time | He usually came late |
| did not remember | forgot |
| did not pay attention to | ignored |
| not important | trifling |

### Use Concrete Language

Prefer specific over general, definite over vague.

| Vague | Concrete |
|-------|----------|
| A period of unfavorable weather set in | It rained every day for a week |
| He showed satisfaction | He grinned |
| productive of great exhilaration | exhilarating |

### Place Emphasis at End

The emphatic position is the end of the sentence.

| Weak | Strong |
|------|--------|
| Humanity has hardly advanced in fortitude since that time, though it has advanced in many other ways | Humanity has advanced in many ways, but hardly in fortitude |

## AI Anti-Patterns to Eliminate

### Puffery Words

Remove: pivotal, crucial, vital, testament, enduring legacy, cornerstone, paramount, transformative

### Empty -ing Phrases

Remove: ensuring reliability, showcasing features, highlighting capabilities, fostering innovation, driving excellence

### Promotional Adjectives

Remove: groundbreaking, seamless, robust, cutting-edge, state-of-the-art, world-class, best-in-class

### Overused AI Vocabulary

Remove: delve, leverage, multifaceted, foster, realm, tapestry, landscape, paradigm, synergy, holistic, utilize (use "use")

### Formatting Overuse

Avoid: excessive bullets, emoji decorations, bold on every other word

## Process

1. Read the draft prose
2. Apply core rules systematically
3. Eliminate AI anti-patterns
4. Return polished text only — no commentary
