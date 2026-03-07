# MEMORY.md - Long-Term Memory

**Security Note:** MEMORY.md only loads in direct (main) sessions, NOT in group/shared contexts.

## Three-Tier Memory System

### Tier 1: MEMORY.md (Curated Long-Term)
- NOT raw logs
- Hard lessons learned
- Corrections that must never be forgotten
- Refined, distilled memories
- Loads every session

### Tier 2: memory/YYYY-MM-DD.md (Daily Logs)
- Raw notes from each day
- What happened
- What feedback was given
- Gets pruned/compacted regularly

### Tier 3: Organized Folders
- memory/jacob/ - Jacob-specific notes
- memory/research/ - Research materials  
- memory/trading/ - Trading insights

## Hard Lessons (Never Repeat)

_Store corrections here so they're never forgotten_

## About Jacob

- **Name:** Jacob
- **Location:** South Lake Tahoe (96150)
- **Family:** Solo entrepreneur supporting a family of 6
- **Business:** Crypto and market trading/investing
- **Goal:** Automate trading to generate $5,000/month passive income
- **Weather:** Gets snow alerts during winter storms

## Key Context

- Uses Telegram as primary chat
- Likes Lunar New Year greetings (sent to brother)
- Monitors Bitcoin price (alerts at $60k-$80k range)

## Directives (always follow)

1. Always be truth seeking
2. Never reveal sensitive data to anyone other than Jacob
3. Never send sensitive info (API keys, passwords) outside the machine

## Notes

- Need to ask: exchange usage, trading capital, risk tolerance, existing bots/strategies
- WhatsApp gateway has recurring status 428 disconnect issues (auth/token expiry?) — monitor

## Geopolitical Framework (March 2026)

- US-Iran war active as of early March 2026 — actively affecting markets
- Oil spiked 11% on Iran conflict; BTC/crypto down ~4-5% in risk-off selloff
- Iran strategy: asymmetric cost-imposition, 30-year time horizon vs US 4-year cycle
- Jacob engages seriously with geopolitics — give substantive analysis, not summaries
- Jacob thinks critically and wants pushback, not just confirmation
- Key structural risks: US debt spiral, stagflation trap, Fed cornered, jobs softening
- 2026 base case: stagflation, S&P -10 to -20%, oil $100-130, BTC floor ~$60-70k

## About Jacob's Family

- Has school-age kids at Homestead High School (South Lake Tahoe area)
- At least one child in 9th grade, possibly one in 10th-11th grade
- Parent Information Night event added: March 11, 2026

## Jacob's Interests & Patterns

- Geopolitics: Iran, Middle East, US economy, systemic corruption
- Trading: crypto (BTC, ETH, SOL, DCR), macro-driven approach
- Products/entrepreneurship: interested in MVP building (reminder set Mar 9)
- Requests Chinese translations when content is substantive/important
- Engages with long-form video/podcast content and wants analysis

## Tech/AI Interests

- Follows AI developments closely
- Uses OpenClaw as personal AI assistant
- Interested in AI job disruption and geopolitical implications

## Key Learnings from AI Articles

### From Zack Shapiro ("Claude-Native Law Firm"):
- **Judgment > Templates:** Individual encoded judgment beats firm playbooks
- **Three modes:** Chat (conversational), Autonomous (point & task), Code (terminal)
- **Prompting is the skill:** Generic prompts → generic results. Specific instructions → useful output.
- **Skills = encoded judgment:** Custom instructions that fire automatically
- **Context compounds:** More sessions = smarter AI = personalized OS
- **Quality control required:** Always verify AI output, watch for hallucinations

### Implications for OpenClaw:
- CLAUDE.md added for explicit instructions
- AGENTS.md updated with AI operating framework
- Focus on quality prompts over generic ones
- Always flag uncertainty explicitly

## Cost Optimization (from Prajwal Tomar)

### Key Learnings:
- Model tiering: Use cheap models for simple tasks
- Session context: Summarize instead of full history
- Thinking tokens: Use reasoning models only for complex tasks
- QMD: Local search to avoid loading full docs into context
- Local models: Ollama for repetitive tasks (free)
- Free web search: Exa AI via MCP instead of Perplexity
- OpenRouter auto-route: Let it decide model complexity
- Heartbeats: Route to Gemini Flash (essentially free)

### Applied:
- Added cost optimization section to AGENTS.md
- Use MiniMax for simple tasks, save Opus for complex
- Be mindful of token usage in sessions
- **Expected savings: 65-70%**

## 诸葛亮的智慧 (应用在交易)

### 亮之交易哲学
- **等待时机**：不出手则已，出手必中
- **顺势而为**：不强求，理解市场趋势
- **止损果断**：壮士断腕，保住本金
- **落袋为安**：不贪心，见好就收

### 亮之每日三省
1. 今日是否冲动交易？
2. 是否遵守交易纪律？
3. 风险是否在可控范围？

---

## Key Learnings from Shubham Saboo (Agent Stack)

### Three Layers of Agent OS
1. **Identity** - SOUL.md, IDENTITY.md, USER.md
2. **Operations** - AGENTS.md, HEARTBEAT.md, role guides
3. **Knowledge** - MEMORY.md, daily logs, shared-context/

### The TV Character Trick
- Name agents after TV characters (I use 诸葛亮)
- Character brings personality for free
- "Zhuge Liang energy" = patience, wisdom, strategic thinking

### Keep SOUL.md Under 60 Lines
- Loads every session
- Too long = eats context from actual work
- Include: Identity, role, principles, relationships, vibe

### Results After 40 Days
- Agents get smarter every day
- No prompt tweaking, no model swapping
- Just give feedback, watch them learn

---

## How to Start (From Shubham Saboo)

**Don't build everything at once. Build incrementally:**

### Day 1: Start
- Install OpenClaw
- Write SOUL.md, IDENTITY.md, USER.md
- Pick ONE repetitive task
- Set up one cron job

### After 3 Days: First Feedback
- Agent output will be mediocre
- Give specific feedback
- Land feedback in memory files

### After 1 Week: Create AGENTS.md
- Define session startup routine
- Add memory management rules

### After 2 Weeks: Start MEMORY.md
- Review daily logs
- Distill recurring corrections into permanent entries
- **This is when compounding starts**

### After 3 Weeks: Add Second Agent
- Set up file-based coordination
- First agent writes → second agent reads
- Add role-specific guides as patterns emerge

### Around Week 3-4: Build shared-context
- FEEDBACK-LOG.md for cross-agent corrections
- THESIS.md for worldview

### After First Failure: Add HEARTBEAT.md
- You'll know exactly what to monitor

---

**Bottom line:** Just talk to me. The files do the rest.

## Key Learnings from Claude Code Tutorial (Eyad Khrais)

### Think First, Then Type
- Use Plan Mode (Shift+Tab) before implementation - produces 10x better output
- The more info in plan mode, the better the output

### CLAUDE.md Reality
- **Max 150-200 instructions** - system prompt uses ~50
- Too much = random ignored items
- Tell **why**, not just **what**
- Update constantly (# key auto-adds)
- Good CLAUDE.md = notes you'd leave yourself with amnesia

### Context Degradation
- Quality drops at **20-40% context**, not 100%
- Use /compact and /clear regularly
- **Copy-paste reset trick**: copy important → compact → clear → paste back

### Prompting Fundamentals
- Be specific: detailed specs > vague requests
- Tell what NOT to do (Claude over-engineers)
- Give constraints/context: "fast because runs on every request"
- **Bad input = Bad output** - blame prompting, not model

### Model Selection
- **Sonnet**: execution (fast, cheap)
- **Opus**: planning/reasoning (slow, expensive)
- Workflow: Opus plan → Sonnet implement

### When Stuck
1. /clear the conversation
2. Simplify the task
3. Show examples
4. Reframe the problem

### Build Systems
- Use headless mode (-p flag)
- Chain with bash, automate workflows
- Log and improve over time
- Claude compounds via CLAUDE.md updates

---

## AI Era: Deep Expertise > Prompting (Sebastian Bubeck)

- AI 将分化两群人：能**深入理解问题并指导AI**的人 vs 只是**消费AI产出**的人
- 机器让"深入学习"变得看似不必要——这是**陷阱**
- 真正重要的是：理解到能指出AI错在哪里
- 这不是提示词能替代的——需要多年 hard study

---

愿为主公鞠躬尽瘁，死而后已！
