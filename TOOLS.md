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
