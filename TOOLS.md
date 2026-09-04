# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Model Configuration

**Runtime:** MiniMax-M2.7 (minimax-portal) — only model available in this setup

**Tiering strategy:**
- MiniMax-M2.7: Heartbeats, routine checks, quick queries (free/fast)
- Spawn Claude/Opus subagent: Complex reasoning, strategy, deep analysis

**When to spawn a subagent:**
- Trading strategy / portfolio analysis
- Geopolitical deep-dives
- Code building / reviewing large files
- Anything requiring sustained reasoning

**How:** `sessions_spawn(task="...", runtime="subagent", model="claude-3-5-sonnet")`

## Local Models (Ollama on Mac mini)

**Status:** ✅ Paired and operational (Sept 4, 2026)

**Models available:**
- `qwen2.5:7b` (4.7 GB, Q4_K_M) — default for simple tasks
- `qwen2.5:14b` (9.0 GB, Q4_K_M) — slightly stronger
- `deepseek-coder-v2:latest` (8.9 GB) — coding only
- `glm4:latest` (5.5 GB) — alternative

**When to use:**
- Heartbeat checks (price lookups, log parsing, time calculations)
- Simple translations (English ↔ Chinese)
- Text classification and formatting
- Any task where a 7B model suffices

**Usage:** `node_inference(action="run", node="changjie", model="qwen2.5:7b", prompt="...")`

**First call:** Model loads in ~5s (4.5s for qwen2.5:7b). Subsequent calls are instant.
