# Knowledge Model

## Layers

| Layer | Location | Access | Contains |
|-------|----------|--------|----------|
| **Systemic** | `vault/00_Brain/Systemic/` | Read | Instructions, methodology, templates |
| **Semantic** | `vault/00_Brain/Semantic/` | Read | Crystallized memory, insights |
| **Synthetic** | `vault/00_Brain/Synthetic/` | Read + Write | Working output, session data |

## Assistant-Specific Paths

For assistant `{name}`:

- Instructions: `vault/00_Brain/Systemic/Assistants/{name}/` (if exists)
- Crystallized memory: `vault/00_Brain/Semantic/Assistants/{name}/memory.md`
- Working output: `vault/00_Brain/Synthetic/Assistants/{name}/`

## Knowledge Flow

```
Systemic (instructions)
    ↓ read
Semantic (crystallized insights)
    ↓ read
Synthetic (working memory)
    ↓ write
    ↑ learn action graduates to Semantic
```
