# Claude Code Skills: Lessons Learned

> Skills are flexible, easy to make, and simple to distribute. This skill captures lessons from building hundreds of skills at Anthropic.

## What Are Skills?

Skills are NOT just markdown files — they're folders that can include:
- Scripts
- Assets
- Data
- Dynamic hooks
- Reference code snippets

## Types of Skills

### 1. Library & API Reference
Skills that explain how to correctly use a library, CLI, or SDK.
- Include edge cases, footguns, gotchas
- Folder of reference code snippets

### 2. Product Verification
Skills that test/verify code works correctly.
- Often paired with external tools (playwright, tmux)
- Include programmatic assertions on state
- Record videos of output for debugging

### 3. Data Fetching & Analysis
Skills that connect to your data/monitoring stacks.
- Libraries to fetch data with credentials
- Dashboard IDs, specific queries
- Common workflow instructions

### 4. Business Process & Automation
Skills that automate repetitive workflows into one command.
- Save previous results in log files for consistency
- Simple instructions but may have complex dependencies

## Best Practices

### Progressive Disclosure
Think of the entire file system as context engineering. Tell Claude what files exist in your skill:
- Point to other markdown files (e.g., `references/api.md`)
- Include template files in `assets/` folder
- Use folders of references, scripts, examples

### Avoid Over-Railroading
Give Claude the information it needs but flexibility to adapt. Don't be too specific.

### Setup Context
For skills needing user context (e.g., which Slack channel), store config in `config.json`. If not set up, ask the user.

### Description Field = When to Trigger
The description is not a summary — it's a description of when to invoke this skill. Write it for the model.

### Memory & Data Storage
- Store data in append-only logs or JSON files
- Or use SQLite for complex data
- Use `${CLAUDE_PLUGIN_DATA}` for stable storage (survives skill upgrades)

### Store Scripts & Generate Code
Give Claude libraries/helper functions so it composes rather than reconstructs boilerplate.

### On-Demand Hooks
Use hooks that activate only when called:
- `/careful` — blocks dangerous commands (rm -rf, DROP TABLE, force-push)
- `/freeze` — blocks edits outside specific directory

## Distributing Skills

1. **Check into repo** (`.claude/skills`) — works for small teams
2. **Plugin marketplace** — for scaling, let team decide which to install

### Managing a Marketplace
- Find skills organically (upload to sandbox first)
- PR to marketplace once skill gains traction
- Curate before release to avoid redundant skills

## Composing Skills
Skills can depend on each other. Reference by name — the model will invoke them if installed.

## Measuring Skills
Use PreToolUse hook to log usage. Find popular skills and under-triggering ones.

---

**Key Insight:** Most skills began as a few lines + one gotcha, then improved over time as Claude hit edge cases. Start simple, iterate.
