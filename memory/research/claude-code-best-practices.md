# Claude Code Best Practices

Source: Eyad Khrais (ex Amazon, Disney, Capital One, now CTO of Varick AI)
Article: "The complete Claude Code tutorial"

## Key Principles

### 1. Think First, Then Type
- Use Plan Mode (Shift+Tab twice) before implementation
- 10x better output than just starting to type
- The more information in plan mode, the better the output

### 2. CLAUDE.md Best Practices
- **Keep it short**: 150-200 instructions max (system prompt uses ~50)
- **Be specific**: Don't explain basics, tell the weird stuff
- **Tell why, not just what**: "Use strict mode because we had production bugs from implicit any" > "Use strict mode"
- **Update constantly**: Press # to add instructions automatically
- **Bad CLAUDE.md**: Documentation for new hire
- **Good CLAUDE.md**: Notes you'd leave yourself if you had amnesia

### 3. Context Window Reality
- Context degrades at **20-40%**, not 100%
- Quality starts dropping before you notice
- Use /compact and /clear regularly
- **Copy-paste reset**: Copy important info, /compact, /clear, paste back

### 4. Prompting is Everything
- Be specific: "Build email/password auth using User model, sessions in Redis, 24h expiry" > "Build auth"
- Tell what NOT to do: Claude over-engineers
- Give context about why: constraints change approach
- **Bad input = Bad output** - blame prompting, not the model

### 5. Model Selection
- **Sonnet**: Faster, cheaper, good for execution
- **Opus**: Slower, expensive, good for planning/reasoning
- Workflow: Use Opus to plan → switch to Sonnet to implement

### 6. When Stuck
1. Clear context (/clear)
2. Simplify task
3. Show examples
4. Reframe the problem

### 7. Build Systems, Not One-offs
- Use headless mode (-p flag)
- Chain with bash, automate workflows
- Log and improve over time
- Claude improves itself via CLAUDE.md updates

## MCP, Hooks, Commands
- MCP: Connect to external services (Slack, GitHub, DBs)
- Hooks: Run Prettier, type checking after each edit
- Slash commands: Package repeated prompts as /command

## External Memory
- Use SCRATCHPAD.md or plan.md for complex work
- Persists across sessions
- Keep at top-level for all tasks
