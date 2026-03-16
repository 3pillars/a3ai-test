# Claude Certified Architect - Learning Plan

**Goal:** Master production AI agent development for trading automation  
**Timeline:** 4-6 weeks (1 domain per week)  
**Prerequisite:** Already using OpenClaw daily

---

## Week 1: Agentic Architecture & Orchestration (27%)

### Learning Objectives
- [ ] Design agentic loops (think → act → evaluate → iterate)
- [ ] Implement multi-agent systems with coordinator-subagent patterns
- [ ] Task decomposition (break complex goals into subtasks)
- [ ] Session state management and workflow enforcement

### Daily Practice
| Day | Topic | Action |
|-----|-------|--------|
| 1 | Agentic loops | Study OpenClaw's subagent system |
| 2 | Multi-agent | Set up 2 agents: planner + executor |
| 3 | Task decomposition | Break trading goal into subtasks |
| 4 | State management | Track trade state across turns |
| 5 | Workflow | Create trading signal → analyze → execute flow |
| 6-7 | Build | Create multi-agent trading assistant |

### Key Concepts
```
User Request
    ↓
[Coordinator Agent] → Break into tasks
    ↓
[Subagent 1: Research] → Gather market data
[Subagent 2: Analyze] → Evaluate signals
[Subagent 3: Execute] → Place trades
    ↓
Synthesize results → Return to user
```

### Resources
- OpenClaw docs: Multi-agent systems
- Superpowers: subagent-driven-development skill
- Anthropic: Agentic patterns documentation

---

## Week 2: Tool Design & MCP Integration (18%)

### Learning Objectives
- [ ] Design effective tool interfaces with clear boundaries
- [ ] Implement structured error responses
- [ ] Integrate MCP servers
- [ ] Distribute tools across multiple agents

### Daily Practice
| Day | Topic | Action |
|-----|-------|--------|
| 1 | Tool basics | Review OpenClaw skills structure |
| 2 | Tool design | Create trading tool: fetch_price |
| 3 | Errors | Add error handling to tools |
| 4 | MCP | Study Model Context Protocol |
| 5 | Integration | Connect external API as tool |
| 6-7 | Build | Create tool suite for trading |

### Tool Template
```python
def fetch_crypto_price(symbol: str) -> dict:
    """
    Fetch current price for a cryptocurrency.
    
    Args:
        symbol: Coin symbol (BTC, ETH, SOL)
    
    Returns:
        {"price": float, "change_24h": float, "error": None}
    
    Raises:
        ValueError: Invalid symbol
        APIError: Exchange unavailable
    """
```

### Key Skills to Create
- [ ] price_fetch - Get live crypto prices
- [ ] order_place - Place exchange orders
- [ ] portfolio_get - Get current holdings
- [ ] news_fetch - Get market news
- [ ] signal_analyze - Analyze trading signals

---

## Week 3: Claude Code Configuration & Workflows (20%)

### Learning Objectives
- [ ] Configure CLAUDE.md hierarchies
- [ ] Create custom slash commands
- [ ] Apply path-specific rules
- [ ] CI/CD integration

### Daily Practice
| Day | Topic | Action |
|-----|-------|--------|
| 1 | CLAUDE.md | Study workspace CLAUDE.md |
| 2 | Hierarchy | Set up project-specific configs |
| 3 | Slash commands | Create /trade, /analyze commands |
| 4 | Path rules | Add rules for trading/ folder |
| 5 | CI/CD | Set up automated testing |
| 6-7 | Build | Configure full workflow |

### CLAUDE.md Template for Trading
```markdown
# Trading Project Rules

## Context
- Project: Automated crypto trading
- Risk tolerance: 1% max per trade
- Paper trading phase: 3 months

## Tools
- Always use price_fetch before trading
- Never execute without SL/TP set

## Workflow
1. Analyze signal
2. Calculate position size
3. Set SL/TP
4. Execute
5. Log to journal
```

---

## Week 4: Prompt Engineering & Structured Output (20%)

### Learning Objectives
- [ ] Design prompts with explicit criteria
- [ ] Apply few-shot techniques
- [ ] Enforce structured output (JSON schemas)
- [ ] Implement validation and retry loops

### Daily Practice
| Day | Topic | Action |
|-----|-------|--------|
| 1 | Prompt basics | Review prompt engineering |
| 2 | Few-shot | Create example-based prompts |
| 3 | JSON output | Force JSON responses |
| 4 | Validation | Add response validation |
| 5 | Retry | Implement retry logic |
| 6-7 | Build | Create analysis prompt library |

### Prompt Templates

**Trading Signal Analysis:**
```markdown
Analyze this trading signal and respond in JSON:

{
  "signal": "BUY/SELL/HOLD",
  "confidence": 0-100,
  "reasoning": "one sentence",
  "risk_level": "LOW/MEDIUM/HIGH",
  "position_size": "percentage of portfolio"
}

Signal: BTC broke resistance at $75k with volume spike
```

**Trade Journal Entry:**
```markdown
Create a journal entry from this trade:
- Entry: $75,000
- SL: $74,250
- TP: $76,500
- Reason: Breakout continuation
```

---

## Week 5: Context Management & Reliability (15%)

### Learning Objectives
- [ ] Preserve critical info across long interactions
- [ ] Design escalation patterns
- [ ] Error propagation in multi-agent systems
- [ ] Confidence calibration

### Daily Practice
| Day | Topic | Action |
|-----|-------|--------|
| 1 | Context | Study memory management |
| 2 | Escalation | Create human handoff flow |
| 3 | Errors | Build error handling system |
| 4 | Confidence | Add uncertainty detection |
| 5 | Reliability | Add retry/fallback logic |
| 6-7 | Build | Complete trading assistant |

### Reliability Patterns
```python
async def execute_trade_with_retry(trade_params, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = await place_order(trade_params)
            if result.confidence < 70:
                await human_approval(result)
            return result
        except APIError as e:
            if attempt == max_retries - 1:
                await alert_human(f"Trade failed: {e}")
            await sleep(exponential_backoff(attempt))
```

---

## Week 6: Integration & Production

### Build Final Project
Create a complete trading assistant that:
1. Fetches market data (tools)
2. Analyzes signals (prompt engineering)
3. Manages state (context)
4. Handles errors (reliability)
5. Uses multi-agent (architecture)
6. Has custom config (CLAUDE.md)

### Deliverables
- [ ] Working trading assistant
- [ ] Tool suite (5+ tools)
- [ ] Prompt library
- [ ] Error handling system
- [ ] Documentation

---

## Progress Tracking

| Week | Domain | Status | Project |
|------|--------|--------|---------|
| 1 | Agentic Architecture | ⬜ | |
| 2 | Tool Design & MCP | ⬜ | |
| 3 | Claude Code Config | ⬜ | |
| 4 | Prompt Engineering | ⬜ | |
| 5 | Context Management | ⬜ | |
| 6 | Integration | ⬜ | |
