# Skills Review - May 28, 2026

## Review Trigger
Jacob asked me to "review all the skills periodically to improve based upon new information"

## Key Context
- X post by @sairahul1: "Build SaaS MVP in One Afternoon Using 7 AI Agents" (Kimi Agent Swarm concept)
- Jacob's operating framework: autonomous mode, skills = encoded judgment
- Skills need to compound over time, not start fresh each session

---

## Skills Inventory

### User-Level (~/.openclaw/skills/)

| Skill | Status | Notes |
|-------|--------|-------|
| trading-research | Good, needs Jacob context | Has scripts but no Jacob-specific rules loaded |
| crypto-price-alert | Generic, needs customization | Needs Jacob's BTC alert range ($60-80k) |
| ai-project-template | Good, solid base | Fits well with agent swarm methodology |
| agent-folder-generator | Haven't reviewed | - |
| xlsx | Haven't reviewed | - |
| pptx | Haven't reviewed | - |
| docx | Haven't reviewed | - |

### System-Level (/opt/homebrew/lib/node_modules/openclaw/skills/)

| Skill | Status | Notes |
|-------|--------|-------|
| coding-agent | Complex but solid | Needs notification route clarity |
| summarize | Good, well documented | - |
| blogwatcher | Good, simple | - |
| skill-creator | Good reference | Best practices doc |
| taskflow | Advanced, reference | Good for complex orchestration |
| model-usage | Utility, minor | - |

---

## Key Improvements Needed

### 1. trading-research - ADD JACOB CONTEXT

**Current state:** Generic crypto trading skill
**Needed:** Jacob-specific rules, ranges, thesis

**Improvements:**
- Add Jacob's 1% risk rule to position-sizer guidance
- Add BTC alert range ($60k-$80k as floor per MEMORY.md)
- Add geopolitical context (US-Iran war, stagflation thesis)
- Add preferred coins (BTC, ETH, SOL, DCR - from MEMORY.md)
- Reference Simon Dixon Bitcoin Sovereignty thesis

**Draft addition:**
```
## Jacob's Context (May 2026)

### Trading Rules
- Max 1% risk per trade (seatbelt rule)
- Top 10 coins only — no shitcoins
- Always set SL + TP before entering
- Wait for YOUR signal — cash is valid position
- Paper trade first (3 months / 50+ trades minimum)

### BTC Thesis
- Floor: $60-70k (CBDC hedge thesis per Simon Dixon)
- Alert zone: $60k-$80k
- Current range: ~$79-81k (bouncing)

### Macro Context
- US-Iran war active (ceasefire fragile, May 15 deadline passed)
- Stagflation base case: S&P -10 to -20%, oil $100-130
- Fed cornered, jobs softening

### Preferred Coins
BTC, ETH, SOL, DCR (top 10 only per MEMORY.md)
```

### 2. crypto-price-alert - INTEGRATE WITH HEARTBEAT

**Current state:** Generic alert description
**Needed:** Jacob-specific alert configuration

**Improvements:**
- Add BTC alert at $60k (floor) and $80k (alert zone)
- Add ETH alert at $3k-4k range
- Configure for Telegram delivery
- Add geopolitical alert triggers (oil spike, Iran escalation)

### 3. ai-project-template - ADD AGENT SWARM SECTION

**Current state:** Spec-driven development methodology
**Needed:** Agent swarm workflow for rapid MVP

**Improvements:**
Add section:
```
## Agent Swarm Workflow (from Kimi/7-Agent System)

For rapid MVP validation, use the 7-agent swarm approach:

1. **Research Agent** → Market validation, target customers, competitors
2. **Product Manager Agent** → MVP scope, features, pricing
3. **UX Agent** → User flow, dashboard, report layout
4. **Frontend Engineer Agent** → UI structure, components
5. **Backend Engineer Agent** → Scoring logic, API design, data model
6. **QA Agent** → Edge cases, missing states, failure modes
7. **Launch Agent** → Landing page, X post, cold email, positioning

**Key insight:** Separation is the system. Each agent stays in its lane.
QA agent attacks without emotional attachment.

**When to use:**
- First pass MVP validation in one afternoon
- Before committing to build
- When you need to validate quickly before investing time
```

---

## Scheduled Review Cadence

**Weekly:** Quick check of active skills (trading-research, summarize)
**Monthly:** Full review of all skills
**After major learnings:** Update relevant skill immediately

---

## Next Actions

1. [ ] Update trading-research with Jacob context → this session
2. [ ] Update crypto-price-alert with Jacob's alert ranges → this session
3. [ ] Update ai-project-template with agent swarm section → this session
4. [ ] Next session: review remaining user-level skills
5. [ ] Schedule monthly review in HEARTBEAT.md