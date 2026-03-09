# Symbiote MVP Project Plan
## Self-Organizing Trading Agent Collective (AI-First Approach)

**Created:** March 2026  
**Updated:** March 2026  
**Purpose:** Actionable startup roadmap for MVP launch using 100% AI agents

---

## Executive Summary

**Key Pivot:** This project will be built with **100% AI agents** instead of human engineers. Jacob serves as CEO with high-level and production-level approvals.

**AI Stack:**
- **Brain:** Kimi K2 (Cloud) — complex reasoning, planning, decision-making
- **Coding/Execution:** Local free LLMs (Ollama models) — code generation, task execution
- **Orchestration:** OpenClaw — agent coordination, workflow management

**Budget Pivot:** From $350K human dev → ~$15K infrastructure (mostly cloud + GPUs)

---

## 1. MVP Scope Definition

### 1.1 Minimum Viable Agent Types (Build First)

| Priority | Agent Type | Why First | Delay Until Post-MVP |
|----------|------------|-----------|---------------------|
| **1** | **Alpha Scanner** | Core value: generates trading signals | — |
| **2** | **Executor Agent** | Executes trades; required for E2E flow | — |
| **3** | **Risk Manager** | Critical safety gate; prevents losses | — |

**Total MVP Agents: 3** (not all 6)

### 1.2 Post-MVP Agent Types

| Agent | When to Build | Trigger |
|-------|---------------|---------|
| Portfolio Rebalancer | Q3 MVP+ | Manual rebalancing working |
| Market Sentiment Agent | Q4 MVP+ | Need for signal enrichment |
| Liquidity Monitor | Q1 Year 2 | Volume justifies complexity |

### 1.3 Smart Contract Features

**Core (MVP - Must Have):**
- ✅ Vault contract (fund custody, multi-sig)
- ✅ Registry contract (agent registration)
- ✅ Profit distribution logic
- ✅ Basic bonding (stake requirement)
- ✅ Emergency pause

**Optional (Post-MVP):**
- ⏸ Advanced slashing conditions
- ⏸ Full dispute resolution court
- ⏸ Cross-chain bridges
- ⏸ Governance token

### 1.4 Feature Scope Summary

| Feature | MVP | Post-MVP |
|---------|-----|----------|
| Agent types | 3 | 6 |
| Supported chains | 1 (Arbitrum) | Multi-chain |
| Trading strategies | 2-3 (momentum, mean-reversion) | 10+ |
| Sentiment integration | Basic API | Full agent |
| Portfolio management | Manual | Auto-rebalance |
| Governance | Jacob (CEO) | Tokenized |
| Cross-chain | No | Yes |

---

## 2. Team Structure — AI-First Model

### 2.1 Human Team (Minimal)

| Role | Headcount | Responsibility |
|------|-----------|----------------|
| **Jacob (CEO)** | 1 | High-level decisions, production approvals, strategy |
| **Operations** | 0-1 | Optional: help with admin, community |

**Jacob's Responsibilities:**
- High-level product decisions (what features to build)
- Production approvals (deploy to mainnet, move real funds)
- Strategic direction (market positioning, pricing)
- Community/investor relations

### 2.2 AI Agent Team

| AI Agent | Capability | Tool |
|----------|-----------|------|
| **Symbiote-Coder** | Smart contract writing, Solidity | Ollama (code generation) |
| **Symbiote-Builder** | Full-stack development, integration | Ollama + Kimi K2 |
| **Symbiote-Researcher** | Market analysis, strategy research | Kimi K2 |
| **Symbiote-Reviewer** | Code review, security analysis | Ollama |
| **Symbiote-DevOps** | Infrastructure, deployment | Ollama + scripts |

### 2.3 How AI Agents Work

**Workflow:**
1. Jacob defines task → OpenClaw spawns agent(s)
2. Kimi K2 does reasoning/planning
3. Local LLMs (Ollama) generate code
4. Agents self-review, iterate
5. Jacob approves before production deployment

**Example Task Flow:**
```
Jacob: "Deploy vault contract to Arbitrum Sepolia"
  → Symbiote-Coder: Writes Solidity contract
  → Symbiote-Reviewer: Security review
  → Symbiote-DevOps: Deploys to testnet
  → Jacob: Approves (or requests changes)
  → Symbiote-DevOps: Ready for mainnet deployment
```

### 2.4 AI Infrastructure Costs (New Budget)

| Category | Monthly Cost | 4-Month Cost | Notes |
|---------|--------------|--------------|-------|
| **Kimi K2 API** | $500 | $2,000 | For reasoning/brain tasks |
| **Ollama Hosting** (local GPU) | $0 | $0 | Running on Jacob's Mac Mini M4 |
| **Cloud GPU** (fallback) | $200 | $800 | For heavy Ollama tasks |
| **Cloud (AWS/GCP)** | $500 | $2,000 | API servers, databases |
| **Blockchain RPC** | $200 | $800 | Alchemy/Infura |
| **Oracles (Chainlink)** | $100 | $400 | Price feeds |
| **Domains/SSL** | $50 | $200 | Basic needs |
| **Security Audit** | $30,000 | $30,000 | External audit (required) |
| **Contingency (15%)** | $230 | $5,400 | Buffer |
| **TOTAL** | | **~$41,600** | **~90% cost reduction** |

---

## 3. Timeline & Milestones

### 3.1 AI-Accelerated Timeline (8 Weeks)

| Week | Phase | Milestone | Deliverables |
|------|-------|-----------|---------------|
| 1-2 | **Foundation** | AI setup | Ollama installed, Kimi K2 configured, OpenClaw workflow, smart contract scaffold |
| 3-4 | **Contracts** | Core contracts | Vault, Registry, ProfitDistributor deployed to testnet (AI-written) |
| 5-6 | **Infrastructure** | Agent runtime | libp2p mesh, MDE, agent containerization, DEX aggregator integration |
| 7 | **Alpha Agent** | Signal generation | Alpha Scanner agent running, publishing signals |
| 8 | **E2E Flow** | MVP ready | Executor + Risk Manager integrated, test trades, basic UI |

### 3.2 Key Milestones with Dates

Assuming start date: **March 15, 2026**

| Milestone | Target Date | Success Criteria |
|-----------|-------------|-------------------|
| M1: AI Stack Ready | March 22 | Ollama + Kimi K2 + OpenClaw configured |
| M2: Contracts on Sepolia | April 5 | Vault + Registry + Distributor deployed |
| M3: Agent Mesh Running | April 19 | 3 agent instances communicating via libp2p |
| M4: First Test Trade | April 26 | End-to-end: signal → risk → execute → record |
| M5: MVP Feature Complete | May 10 | All 3 agents working, basic UI, monitoring |
| M6: Security Audit Complete | May 31 | External audit passed |
| M7: Mainnet Launch | June 7 | Live on Arbitrum with test capital |

**MVP Launch Target: June 7, 2026** (8 weeks, not 12)

### 3.3 Phase Breakdown

**Phase A: AI Infrastructure (Weeks 1-2)**
- [ ] Configure Ollama on local GPU
- [ ] Set up Kimi K2 API access
- [ ] Create OpenClaw workflow templates for each agent role
- [ ] Smart contract scaffold generated by AI
- [ ] CI/CD pipeline for AI-generated code

**Phase B: Smart Contracts (Weeks 3-4)**
- [ ] AI writes Vault contract
- [ ] AI writes Registry contract
- [ ] AI writes ProfitDistributor
- [ ] Deploy to Arbitrum Sepolia
- [ ] Human (Jacob) review + approval

**Phase C: Agent Core (Weeks 5-6)**
- [ ] Market Data Engine (AI-built)
- [ ] libp2p networking setup
- [ ] Alpha Scanner implementation
- [ ] DEX aggregator integration (0x/1inch)
- [ ] Container orchestration

**Phase D: Execution & Launch (Weeks 7-8)**
- [ ] Executor Agent
- [ ] Risk Manager
- [ ] Profit distribution integration
- [ ] Basic UI dashboard
- [ ] Security audit
- [ ] Mainnet deployment

---

## 4. Budget Estimates

### 4.1 AI-First Budget

| Category | Cost | Notes |
|----------|------|-------|
| Kimi K2 API | $2,000 | 4 months usage |
| Cloud (AWS/GCP) | $2,000 | API servers, PostgreSQL |
| Blockchain RPC | $800 | Alchemy/Infura |
| Oracles | $400 | Chainlink price feeds |
| Domains/SSL | $200 | Basic needs |
| Security Audit | $30,000 | External audit (required) |
| Contingency (15%) | $5,400 | Buffer |
| **TOTAL MVP** | **$40,800** | **vs. $350K traditional** |

### 4.2 Comparison: Traditional vs. AI-First

| Category | Traditional | AI-First | Savings |
|----------|-------------|----------|---------|
| Development | $250,000 | $0 | $250,000 |
| Infrastructure | $12,000 | $5,400 | $6,600 |
| Audit | $50,000 | $30,000 | $20,000 |
| Team | $100,000 | $0 | $100,000 |
| **Total** | **$412,000** | **$40,800** | **$371,200 (90%)** |

### 4.3 Post-MVP Costs (Monthly - Steady State)

| Category | Monthly Cost |
|----------|--------------|
| Kimi K2 API | $500 |
| Cloud + RPC | $600 |
| Oracles | $100 |
| Gas Costs | $500 |
| **Total** | **$1,700/mo** |

---

## 5. Technical Decisions for MVP

### 5.1 AI Tool Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Brain** | Kimi K2 (Cloud) | Complex reasoning, planning, architecture decisions |
| **Coding** | Ollama (Local) | Code generation: Solidity, Python, TypeScript |
| **Orchestration** | OpenClaw | Agent spawning, workflow, approval gates |
| **Execution** | Claude Code / Codex | For complex code tasks Ollama can't handle |

### 5.2 Agent Workflow

```
Task from Jacob
       ↓
  Kimi K2 (Plan)
       ↓
  Ollama (Code)
       ↓
  Self-Review (Ollama)
       ↓
  Jacob Approval (Production only)
       ↓
  Deploy
```

### 5.3 Blockchain Selection

**Recommendation: Arbitrum One (Layer 2)** — unchanged

| Factor | Arbitrum | Base | Solana |
|--------|----------|------|--------|
| Gas Costs | Low ($0.10-0.50) | Very Low ($0.01-0.10) | Low ($0.001) |
| EVM Compatible | ✅ Full | ✅ Full | ❌ No |
| TVL | $15B+ | $5B+ | Limited |
| Tooling | Excellent | Good | Moderate |

### 5.4 Build vs Buy

| Component | Approach | Rationale |
|-----------|----------|-----------|
| Smart Contracts | AI-write + Human review | Core IP |
| Agent Runtime | Build | Custom |
| libp2p Mesh | Build | Differentiation |
| Price Feeds | Buy (Chainlink) | Battle-tested |
| DEX Routing | Buy (0x/1inch) | Don't reinvent |
| Frontend | AI-build | Save time |

---

## 6. Go-to-Market Strategy

### 6.1 AI-Accelerated GTM

Because we're building faster and cheaper, we can iterate on GTM quickly.

**Beta User Acquisition:**

| Segment | Target # | Channel |
|---------|----------|---------|
| Crypto traders (bot users) | 50 | Discord, Reddit |
| DeFi power users | 20 | Discord, Telegram |
| AI/crypto Twitter | 20 | Twitter/X |
| Friends/family | 10 | Personal network |

### 6.2 Pricing

| Tier | Price | Target |
|------|-------|--------|
| **Beta** | **Free** | 50-100 users |
| **Starter** | $29/mo | Retail |
| **Pro** | $99/mo | Serious retail |

**Revenue:** 2% performance fee + subscription

### 6.3 Timeline

- Week 6: Private alpha (10 users)
- Week 8: Public beta opens
- Week 10: Paid tier launches

---

## 7. Risk Mitigation

### 7.1 AI-Specific Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI code quality issues | Medium | High | Human review mandatory; test extensively |
| AI hallucination | Medium | Medium | Self-review agents; Jacob approval gate |
| Local GPU insufficient | Low | Medium | Cloud fallback; upgrade Mac Mini |
| Kimi K2 API issues | Low | Medium | Caching; fallback to Claude Code |

### 7.2 Security Risks

| Risk | Mitigation |
|------|------------|
| Smart contract bugs | External audit before mainnet; upgradeable proxy |
| AI-written vulnerable code | Mandatory security review agent; conservative approach |
| Key management | Multi-sig; hardware wallet; Jacob controls |

### 7.3 Operational Risks

| Risk | Mitigation |
|------|------------|
| Jacob burn out | Automate as much as possible; clear workflows |
| Market timing | Ship MVP fast; iterate based on feedback |

---

## 8. Jacob's Role (CEO)

### 8.1 Decision Authority

| Decision Type | Who Decides | Examples |
|---------------|-------------|----------|
| **High-Level** | Jacob | Feature priorities, strategic direction, pricing |
| **Production** | Jacob | Deploy to mainnet, move real funds, launch |
| **Tactical** | AI Agents | Code generation, testing, deployment to testnet |

### 8.2 Approval Workflow

```
AI generates code/plan
       ↓
AI self-reviews
       ↓
Jacob reviews (async)
       ↓
Approve → Deploy OR Request Changes
       ↓
AI迭代 → Repeat
```

### 8.3 Time Commitment (Estimate)

| Week | Jacob Time |
|------|-----------|
| 1-2 | 5-10 hrs (setup) |
| 3-4 | 5 hrs/week (code review) |
| 5-8 | 5-10 hrs/week (testing, approvals) |

---

## 9. Summary

### Key Metrics

| Metric | Traditional | AI-First |
|--------|-------------|----------|
| Timeline | 16 weeks | 8 weeks |
| Budget | $350-400K | ~$41K |
| Team | 2-3 humans | 1 human (Jacob) |
| Dev Cost | $250K | $0 |

### Next Steps (This Week)

1. ✅ Confirm AI-first approach
2. **Configure Ollama** on Mac Mini M4
3. **Set up Kimi K2** API access
4. **Create OpenClaw** workflow templates
5. **Start Week 1:** AI infrastructure setup

---

*Plan updated for 100% AI agent development model*
*Jacob as CEO: High-level + Production approvals*
