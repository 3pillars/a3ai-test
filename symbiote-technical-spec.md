# Symbiote Technical Specification

## Self-Organizing Trading Agent Collective

**Version:** 1.0  
**Status:** Technical Specification  
**Date:** 2026-03-09

---

## 1. System Overview

### 1.1 Architecture Diagram Description

Symbiote is a decentralized, autonomous trading system composed of specialized AI agents that collaborate without central orchestration. The architecture follows a **mesh-based peer-to-peer model** where agents register capabilities, discover each other via a distributed registry, and negotiate task execution through a market-style auction/bidding mechanism.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ORACLE LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Price Feeds │  │  TVL Feeds  │  │ Sentiment   │  │  Liquidity  │    │
│  │ (Chainlink) │  │ (DeFi Llama)│  │ (Social API)│  │   (Gecko)   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
└─────────┼────────────────┼────────────────┼────────────────┼─────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA AGGREGATION LAYER                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Market Data Engine (MDE)                       │    │
│  │  • Normalizes data from multiple sources                            │    │
│  │  • Computes derived metrics (volatility, momentum, correlation)     │    │
│  │  • Publishes to agent-specific topic streams                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AGENT COLLECTIVE (Mesh)                            │
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Alpha   │◄──►│ Executor │◄──►│  Risk    │◄──►│Portfolio │              │
│  │ Scanner │    │  Agent   │    │ Manager  │    │Rebalancer│              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │               │                     │
│       └───────────────┴───────┬───────┴───────────────┘                     │
│                               │                                             │
│       ┌──────────┐    ┌───────┴───────┐    ┌──────────┐                   │
│       │ Market  │◄──►│   Registry    │◄──►│Liquidity │                   │
│       │Sentiment│    │  (Smart      │    │ Monitor  │                   │
│       └─────────┘    │   Contract)  │    └──────────┘                    │
│                      └───────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXECUTION LAYER                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │  DEX Aggregator  │  │  Order Router   │  │  Bridge Router  │          │
│  │ (0x/Gnosis)     │  │ (1Inch/ParaSwap)│  │ (LayerZero)    │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
│           │                    │                    │                     │
│           ▼                    ▼                    ▼                     │
│  ┌──────────────────────────────────────────────────────────────┐        │
│  │              Vault Smart Contract (Multi-sig)                │        │
│  │  • Trade execution via signature aggregation                  │        │
│  │  • Profit/loss tracking per agent strategy                    │        │
│  │  • Emergency pause capability                                 │        │
│  └──────────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Core Design Principles

1. **Autonomy with Accountability** — Each agent operates independently but bonds collateral; misbehavior results in slashing
2. **Emergent Coordination** — No central brain; coordination emerges from agent-to-agent negotiation
3. **Economic Alignment** — All agents economically incentivized to collaborate rather than compete
4. **Byzantine Fault Tolerance** — System functions even when some agents act maliciously

---

## 2. Agent Types & Roles

### 2.1 Alpha Scanner

**Purpose:** Continuously scan markets for trading signals and inefficiencies.

**Responsibilities:**
- Monitor on-chain data (DEX volumes, whale movements via交易追踪), off-chain data (funding rates, order book depth)
- Run multiple strategy kernels simultaneously (momentum, mean-reversion, arbitrage, macro-driven)
- Generate alpha signals with confidence scores and suggested position sizes
- Publish signals to the collective's signal marketplace

**Technical Specs:**
- Subscribes to: Price feeds, whale wallet tracking (Nansen API), social sentiment streams
- Outputs: Signed alpha propositions with TTL (time-to-live), confidence (0-100), expected Sharpe ratio
- Execution: Runs strategy kernels as isolated WASM modules for sandboxing

**Reputation System:**
- Tracks historical alpha quality (precision/recall of signals)
- Alpha that converts to profitable trades increases reputation
- Reputation determines priority in signal marketplace auctions

### 2.2 Executor Agent

**Purpose:** Execute trades on behalf of the collective with minimal slippage and gas.

**Responsibilities:**
- Receive trade requests from other agents (via task marketplace)
- Route orders through optimal DEX/aggregator based on gas costs, slippage, and speed
- Split large orders across time/venues to minimize market impact
- Handle cross-chain execution when arbitrage/opportunities span networks

**Technical Specs:**
- Maintains connections to: 0x API, 1inch API, ParaSwap API, Gnosis Protocol
- Implements: TWAP/VWAP algorithms, gas price optimization, MEV protection via Flashbots
- Stores: Recent trade history, gas price curves, venue liquidity maps
- Uses: Flashbots Protect RPC for MEV-resistant transactions when available

**Bidding Model:**
- Executor bids on trade requests with a fee quote (flat pass fee + gas-through)
- Competes on: speed guarantee, slippage protection track record

### 2.3 Risk Manager

**Purpose:** Pre-trade and post-trade risk control for all collective activities.

**Responsibilities:**
- Validate all proposed trades against portfolio limits, position size caps, and correlation thresholds
- Enforce global risk parameters: max drawdown, daily loss limit, leverage caps
- Calculate portfolio VaR (Value at Risk) and Greeks exposure in real-time
- Trigger circuit breakers when anomalous conditions detected

**Technical Specs:**
- Pre-trade checks:
  - Position size < 2% of TVL (configurable)
  - No more than 3 correlated positions (>0.7 correlation) in same asset class
  - Portfolio delta exposure within [-20%, +20%] of target
  - Daily P&L loss trigger at -1.5% of portfolio
- Post-trade: Updates portfolio risk metrics every 30 seconds
- Runs: Monte Carlo simulations for tail risk estimation (1000+ paths)

**Authority:**
- Can veto any trade without appeal during "red" market conditions
- Has emergency stop authority (triggers vault pause)

### 2.4 Portfolio Rebalancer

**Purpose:** Maintain target allocation and optimize capital efficiency across strategies.

**Responsibilities:**
- Rebalance portfolio to maintain strategic asset allocation (e.g., 60% BTC, 30% alts, 10% stable)
- Manage idle capital: deploy into yield strategies when not in active positions
- Rebalance strategy weights based on recent performance and risk-adjusted returns
- Handle margin rebalancing for leveraged positions

**Technical Specs:**
- Rebalancing triggers:
  - Drift > 5% from target allocation
  - Weekly scheduled rebalance (default)
  - Ad-hoc when capital efficiency drops below threshold
- Integration: Yearn Vaults, Aave for idle capital deployment
- Optimization: Uses quadratic programming for minimum-trade rebalancing

**Decision Process:**
1. Calculate current allocation vs target
2. Identify rebalance trades needed
3. Submit trade requests to Executor agents (via marketplace)
4. Monitor execution and confirm rebalance completion

### 2.5 Market Sentiment Agent

**Purpose:** Aggregate and quantify market sentiment from diverse sources to anticipate trend shifts.

**Responsibilities:**
- Monitor social media (Twitter/X, Reddit, Telegram), news APIs, and on-chain signals
- Generate sentiment scores (bullish/bearish/neutral) with confidence intervals
- Detect sentiment divergences from price (contrarian signals)
- Alert when sentiment reaches extreme readings (fear/greed extremes)

**Technical Specs:**
- Data sources:
  - Twitter/X: Social sentiment API (Dune Analytics or custom)
  - Reddit: Reddit API (subreddit monitoring)
  - News: NewsAPI, Benzinga, or Bloomberg terminal
  - On-chain: Exchange net flow, exchange reserve changes
- Outputs: Composite sentiment index (-100 to +100), divergence alerts, trend momentum scores
- Models: Fine-tuned sentiment classification model + LSTM for temporal patterns

**Usage:**
- Alpha Scanner incorporates sentiment signals into alpha generation
- Risk Manager uses sentiment extremes as risk amplifiers

### 2.6 Liquidity Monitor

**Purpose:** Track liquidity conditions across venues to prevent execution failure and identify opportunities.

**Responsibilities:**
- Monitor liquidity depth across DEXs and aggregators in real-time
- Alert when executing large trades would incur excessive slippage (>1%)
- Detect liquidity traps (shallow pools that can be easily manipulated)
- Identify liquidity migration (capital moving between protocols)

**Technical Specs:**
- Polls: DEX APIs (Uniswap, Curve, Balancer), aggregator APIs, CoinGecko for market cap/ circulating supply
- Metrics tracked:
  - Slippage estimates for order sizes (1%, 5%, 10% of pool)
  - Bid-ask spreads
  - 24-hour volume
  - Concentration (top 10 wallets %)
- Outputs: Liquidity scores per venue, slippage prediction models, liquidity alerts

**Safety Role:**
- Prevents Executor from routing trades to venues with insufficient liquidity
- Can pause trading on an asset if liquidity collapses below safety threshold

---

## 3. Communication Protocol

### 3.1 Agent Discovery & Registry

Agents join the collective by deploying a **Registry Contract** (onchain) and broadcasting their capabilities via **libp2p** (offchain).

**Registry Contract (Solidity):**
```solidity
interface IAgentRegistry {
    function registerAgent(
        AgentInfo memory info,
        uint256 stakeAmount,
        bytes calldata metadata
    ) external returns (bytes32 agentId);
    
    function updateCapability(
        bytes32 agentId,
        string[] memory capabilities,
        uint256[] memory prices
    ) external;
    
    function getAgent(bytes32 agentId) external view returns (AgentInfo memory);
    function listAgentsByCapability(string memory capability) external view returns (bytes32[] memory);
}
```

**Agent Info Structure:**
```solidity
struct AgentInfo {
    address owner;              //EOA or Gnosis Safe
    bytes32 agentType;          // keccak256("EXECUTOR"), keccak256("RISK_MANAGER"), etc.
    string[] capabilities;      // ["TRADE_EXECUTION", "CROSS_CHAIN_SWAP"]
    uint256[] prices;           // Pricing for each capability (in native token)
    uint256 stakeAmount;        // Bonded collateral (slashed on misbehavior)
    uint256 reputationScore;    // Accumulated reputation (0-10000)
    uint256 lastHeartbeat;      // Unix timestamp
    bool isActive;
}
```

**Discovery Protocol (libp2p):**
- Each agent runs a libp2p node with a circuit relay for NAT traversal
- Discovery via **Peer Discovery Protocol (PIP)** — agents announce capabilities on topics like `/symbiote/alpha-scanner/mainnet`
- Gossip protocol propagates agent state changes across the mesh
- Kademlia DHT used for agent lookup by capability

### 3.2 Task Marketplace & Negotiation

When an agent needs another agent's capability, it posts a **Task Request** to the marketplace. Agents bid on tasks.

**Task Request Message (JSON over libp2p pub/sub):**
```json
{
  "taskId": "0xabc123...",
  "taskType": "EXECUTE_TRADE",
  "requiredCapability": "TRADE_EXECUTION",
  "deadline": 1709999999,
  "params": {
    "assetIn": "0x2260...",
    "assetOut": "0xEeeee...",
    "amountIn": "1000000000000000000",
    "maxSlippage": 50,
    "destinationChain": 1
  },
  "minReputation": 500,
  "escrowAmount": "500000000000000000"
}
```

**Bidding Process:**
1. Task request published to `/symbiote/marketplace/{taskType}`
2. Eligible agents submit bids within 30 seconds (configurable)
3. Bid includes: agentId, execution guarantee (slippage cap), fee quote, execution time estimate
4. Task requester evaluates bids using multi-criteria:
   - Price (40% weight)
   - Reputation score (30% weight)
   - Historical slippage performance (30% weight)
4. Winner selected, task assigned via direct libp2p stream

**Task Result:**
```json
{
  "taskId": "0xabc123...",
  "status": "COMPLETED",  // or FAILED, TIMEOUT
  "result": {
    "txHash": "0x...",
    "amountOut": "998000000000000000",
    "gasUsed": 150000,
    "slippage": 0.2
  },
  "signature": "0x...",
  "timestamp": 1709999999
}
```

### 3.3 Inter-Agent Communication Patterns

| Pattern | Use Case | Protocol |
|---------|----------|----------|
| Request-Reply | Alpha Scanner → Executor (execute trade) | Direct libp2p stream |
| Pub-Sub | Risk Manager → All (risk alert) | libp2p pub/sub topic |
| Broadcast | Registry updates | libp2p gossip + onchain event |
| Streaming | Market Data Engine → All agents | libp2p substream (Yamux) |

**Message Signing:**
- All inter-agent messages signed with agent's Ed25519 or ECDSA key
- Messages include: `sender`, `recipient`, `timestamp`, `nonce`, `payload`, `signature`
- Recipients verify signature before processing

---

## 4. Smart Contract Design

### 4.1 Profit Splitting & Escrow

The vault contract manages funds and distributes profits based on agent contributions.

**Vault Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                      SymbioteVault (Proxy)                      │
├─────────────────────────────────────────────────────────────────┤
│  • Accepts deposits (whitelist or public)                      │
│  • Holds trading capital                                        │
│  • Executes trades via signature aggregation                   │
│  • Tracks P&L per strategy/agent                                │
│  • Distributes profits according to share weights               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ProfitDistributor                            │
├─────────────────────────────────────────────────────────────────┤
│  • Calculates net P&L after fees                                │
│  • Allocates to:                                                │
│    - Strategy agents (70% of net profit)                        │
│    - Executor agents (15% of net profit)                        │
│    - Treasury/Risk Pool (10%)                                   │
│    - Stakers/LPs (5%)                                           │
│  • Handles compound vs harvest mode                             │
└─────────────────────────────────────────────────────────────────┘
```

**Profit Calculation:**
```solidity
struct AgentPerformance {
    bytes32 agentId;
    uint256 totalTrades;
    uint256 winningTrades;
    uint256 totalVolume;
    int256 pnl;           // Realized P&L attributable to this agent
    uint256 feesEarned;   // Fees paid to executor/risk manager
    uint256 lastUpdate;
}

function calculateProfitShare(bytes32 agentId) public view returns (uint256) {
    AgentPerformance memory perf = performance[agentId];
    uint256 baseShare = perf.pnl > 0 ? uint256(perf.pnl) : 0;
    
    // Apply performance multiplier based on Sharpe ratio
    uint256 sharpeMultiplier = getSharpeMultiplier(agentId);  // 0.8x - 1.5x
    
    return (baseShare * sharpeMultiplier) / 1e18;
}
```

### 4.2 Escrow & Bonding

All agents must stake collateral to participate. This bond is slashed for poor performance or malicious behavior.

**Bonding Contract:**
```solidity
struct AgentBond {
    uint256 stakedAmount;
    uint256 slashedAmount;     // Accumulated slashing
    uint256 lockedAmount;      // Currently locked in active tasks
    uint256 withdrawableAmount;
    uint256 lockEndTime;
}

function slashAgent(bytes32 agentId, uint256 slashAmount, string calldata reason) external onlyRole(SLASHER_ROLE) {
    require(performance[agentId].pnl < -THRESHOLD, "Insufficient grounds for slash");
    AgentBond storage bond = bonds[agentId];
    bond.slashedAmount += slashAmount;
    bond.stakedAmount -= slashAmount;
    
    // Transfer slashed amount to treasury
    IERC20(stakeToken).transfer(treasury, slashAmount);
    
    emit AgentSlashed(agentId, slashAmount, reason);
}
```

**Slashing Conditions:**
| Condition | Slash Amount |
|-----------|--------------|
| Failed execution (own fault) | 10% of task escrow |
| Repeated trade failures (>3 in 24h) | 25% of bond |
| Oracle manipulation attempt | 100% of bond + ban |
| Collusion with executor | 100% of bond + ban |
| Downtime (>24h without heartbeat) | 5% of bond |

### 4.3 Dispute Resolution

Disputes arise when task execution fails, results are contested, or agents disagree on outcome.

**Dispute Flow:**
```
1. Agent initiates dispute (within 24h of task completion)
   └─> Submits evidence (signatures, tx data, timestamps)
   
2. Dispute Court (3-of-5 randomly selected judge agents)
   ├─> Review evidence
   ├─> Query oracle for on-chain verification
   └─> Vote (majority wins)
   
3. Resolution
   ├─> Upheld: Slashing applied to offending agent
   └─> Overturned: Task requester pays dispute fee
```

**Dispute Contract:**
```solidity
enum DisputeOutcome { Pending, Upheld, Overturned, Split }

struct Dispute {
    bytes32 taskId;
    bytes32 initiator;
    bytes32 respondent;
    string evidenceCID;  // IPFS reference
    uint256 stake;       // Dispute bond
    DisputeOutcome outcome;
    uint256 rulingAmount;
}

function resolveDispute(bytes32 disputeId, DisputeOutcome outcome, uint256 rulingAmount) 
    external onlyRole(DISPUTE_JUDGE) {
    Dispute storage d = disputes[disputeId];
    d.outcome = outcome;
    d.rulingAmount = rulingAmount;
    
    if (outcome == DisputeOutcome.Upheld) {
        slashAgent(d.respondent, d.rulingAmount, "Dispute ruled against");
    } else if (outcome == DisputeOutcome.Overturned) {
        // Return stake to initiator, charge respondent
        IERC20(stakeToken).transfer(d.initiator, d.stake);
        slashAgent(d.respondent, d.stake * 2, "Frivolous dispute defense");
    }
}
```

---

## 5. Data Flow

### 5.1 Market Data → Agents

```
[External Data Sources]
        │
        ▼
┌───────────────────┐
│  Oracle Layer     │ ◄── Chainlink, Band Protocol, DeFi Llama
│  (Data Feeds)     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  MDE (Aggregator) │ ◄── Normalizes, validates, enriches
│                   │     Computes derived metrics
└─────────┬─────────┘
          │
          ▼ (libp2p pub/sub)
┌──────────────────────────────────────────────────────────┐
│  Agent Streams                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Alpha       │ │ Risk        │ │ Sentiment   │        │
│  │ Scanner     │ │ Manager     │ │ Agent       │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
└──────────────────────────────────────────────────────────┘
```

**Data Stream Format (MessagePack over libp2p):**
```msgpack
{
  "type": "price_update",
  "symbol": "BTC/USD",
  "price": 65432.50,
  "timestamp": 1709999999,
  "source": "chainlink",
  "confidence": 0.99,
  "blockNumber": 18945678
}
```

**Subscription Model:**
- Agents subscribe to relevant topics: `/symbiote/prices/{chain}/{asset}`, `/symbiote/sentiment/{asset}`
- MDE publishes updates as they arrive (push model)
- Agents can request historical data via `/symbiote/history` topic

### 5.2 Decision → Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. ALPHA GENERATION                                                  │
│    Alpha Scanner detects opportunity                                 │
│    └─> Generates signed signal with params                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. RISK VALIDATION                                                   │
│    Risk Manager receives signal                                      │
│    └─> Validates: position size, correlation, VaR                   │
│    └─> Approve (sign) OR Veto (reject with reason)                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. TASK MARKETPLACE                                                   │
│    If approved: post trade request to marketplace                    │
│    └─> Executor agents bid                                            │
│    └─> Winner selected                                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. EXECUTION                                                          │
│    Winning Executor:                                                  │
│    └─> Fetches optimal route (1inch/0x API)                          │
│    └─> Constructs transaction                                        │
│    └─> Signs with vault delegate key                                 │
│    └─> Submits to network                                            │
│    └─> Broadcasts tx hash to collective                             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. CONFIRMATION & RECORDING                                          │
│    Executor reports result                                           │
│    └─> Risk Manager updates portfolio metrics                       │
│    └─> ProfitDistributor updates agent P&L                           │
│    └─> Reputation system updates scores                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Latency Requirements

| Stage | Target Latency | Mechanism |
|-------|---------------|-----------|
| Data feed → MDE | < 500ms | WebSocket push |
| MDE → Agent | < 100ms | libp2p pub/sub |
| Alpha → Risk validation | < 200ms | Direct stream |
| Risk → Marketplace | < 100ms | libp2p pub/sub |
| Marketplace → Executor bid | < 2s | Auction window |
| Executor → On-chain | Variable | Block time |

---

## 6. Security Considerations

### 6.1 Malicious Agent Prevention

**Sybil Attack Prevention:**
- High stake requirement to join (e.g., 10 ETH minimum)
- Reputation accumulation requires consistent good behavior over time
- Gradual capability expansion (new agents limited to small trades initially)

**Collusion Detection:**
- Monitor co-signature patterns (agents consistently selecting same executors)
- Flag statistically anomalous cooperation (e.g., Alpha always approving Executor's trades)
- Random task assignment for a portion of trades (bypassing marketplace)

**Sandboxing:**
- Each agent runs in isolated container/VM
- Agent code signed and verified before deployment
- No direct filesystem or network access except through defined APIs

**Bond Slashing Triggers:**
```solidity
// Automatic slashing conditions
if (agent.collusionScore > COLLUSION_THRESHOLD) slashFull();
if (agent.sybilIndicators > 0) slashFull();
if (agent.oracleManipulationAttempt) slashFull() + ban();
```

### 6.2 Oracle Manipulation Prevention

**Multi-Source Price Feeds:**
- Never rely on single oracle — require consensus among 3+ sources
- Sources: Chainlink, Band Protocol, Uniswap TWAP, internal oracle
- If deviation > 1% between any two sources → alert, pause trading

**TWAP (Time-Weighted Average Price):**
- For large trades, use TWAP to prevent oracle manipulation via flash loans
- TWAP window: 15 minutes minimum for significant positions

**Circuit Breakers:**
```solidity
circuitBreaker[asset] = {
    priceChangeThreshold: 5%,    // Max 5% price move in 1 hour
    volumeSpikeThreshold: 10x,   // Max 10x average volume
    liquidityDropThreshold: 50%  // Max 50% liquidity drain
};
```

**Oracle Dispute:**
- Agents can challenge oracle prices with on-chain evidence
- Challenge requires stake; successful challenger wins from oracle bond

### 6.3 Rugpull Prevention

**Multi-Sig Vault:**
- All fund movements require multi-sig authorization
- Signature threshold: 2-of-3 for routine trades, 3-of-5 for parameter changes
- Signers: Governance contract, Risk Manager (always required), rotating executor

**Withdrawal Delays:**
- Large withdrawals (>10% of TVL) subject to 48-hour timelock
- During timelock: Risk Manager can veto if risk conditions detected
- Emergency withdrawal (via 4-of-5 signers) bypasses timelock

**Asset Whitelisting:**
- Only approved assets can be traded (ETH, BTC, major stablecoins, top 20 by market cap)
- Adding new assets requires governance vote
- Blacklist: Known scam tokens, honeypots, high-risk bridges

**Exit Clauses:**
- Individual agents can exit with their reputation score (portable to other collectives)
- Collective can vote to dissolve and return remaining capital to depositors
- Wind-down period: 7 days, no new positions, existing positions close at maturity

---

## 7. Tech Stack Recommendations

### 7.1 Blockchain Layer

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Chain** | Arbitrum Sepolia (test) → Arbitrum One (prod) | Low gas, EVM compatibility, fast finality |
| **Vault** | OpenZeppelin Governor + TimelockController | Battle-tested, upgradeable via proxy |
| **Registry** | Custom Solidity contract | Optimized for agent registration |
| **Oracle** | Chainlink Data Feeds + Uniswap TWAP | Decentralized, battle-tested |

### 7.2 Agent Runtime

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Agent Host** | Docker containers on Kubernetes | Isolation, auto-scaling, restart on failure |
| **Message Bus** | libp2p + GossipSub | Decentralized, NAT traversal, pub/sub |
| **Data Streaming** | Yamux (libp2p) | Multiplexing multiple streams per connection |
| **Storage** | Ceramic Network (streams) + PostgreSQL (persistent) | Decentralized identity, SQL for analytics |

### 7.3 External APIs

| Data Type | Primary | Fallback |
|-----------|---------|----------|
| **Prices** | Chainlink | Uniswap TWAP |
| **Dex Routing** | 0x API | 1inch API, Paraswap |
| **Gas Prices** | BlockNative | EIP-1559 gas estimator |
| **Social Sentiment** | LunarCrush | Custom Twitter API scraper |
| **On-chain Data** | Alchemy/Infura RPC | Dune Analytics |
| **Portfolio Analytics** | DeBank | Zapper |

### 7.4 Agent Frameworks

| Agent Component | Recommendation |
|-----------------|----------------|
| **LLM/Reasoning** | Claude API (for complex decisions), local Llama (simple) |
| **Strategy Execution** | Rust + WebAssembly (strategy kernels) |
| **ML Models** | PyTorch + ONNX runtime in container |
| **Monitoring** | Prometheus + Grafana |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) |

### 7.5 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS/Cloud                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Kubernetes Cluster                    │  │
│  │                                                            │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │
│  │  │ Alpha   │ │ Executor│ │  Risk   │ │  Other  │       │  │
│  │  │ Scanner │ │  Agent  │ │ Manager │ │ Agents  │       │  │
│  │  │ (x3)    │ │  (x5)   │ │  (x2)   │ │  (xn)   │       │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │           System Services                         │    │  │
│  │  │  • libp2p Bootstrap Nodes (3)                   │    │  │
│  │  │  • Redis (caching, pub/sub)                      │    │  │
│  │  │  • PostgreSQL (state)                            │    │  │
│  │  │  • Prometheus/Grafana                            │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain (L2)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Vault     │  │  Registry   │  │ Distributor │            │
│  │  Contract   │  │  Contract   │  │  Contract   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-4)
- Deploy Registry and Vault contracts
- Build MDE and connect to testnet oracles
- Implement libp2p mesh between agent nodes
- Basic Agent implementations (Alpha Scanner, Executor)

### Phase 2: Market Integration (Weeks 5-8)
- Integrate DEX aggregators (0x, 1inch)
- Implement Risk Manager pre-trade validation
- Connect price feeds and sentiment APIs
- End-to-end trade flow testing

### Phase 3: Economic Layer (Weeks 9-12)
- Implement profit distribution
- Deploy bonding and slashing mechanisms
- Build dispute resolution system
- Launch on testnet with simulated trading

### Phase 4: Production Launch (Weeks 13-16)
- Security audit (external)
- Mainnet deployment
- Gradual capital onboarding
- Governance activation

---

## Appendix: Message Types Summary

| Message Type | Direction | Protocol |
|--------------|-----------|----------|
| `AGENT_REGISTER` | Agent → Registry | On-chain + libp2p |
| `SIGNAL_PUBLISH` | Alpha → Marketplace | libp2p pub/sub |
| `TRADE_REQUEST` | Any → Marketplace | libp2p pub/sub |
| `BID_SUBMIT` | Executor → Marketplace | libp2p direct |
| `TASK_ASSIGN` | Marketplace → Executor | libp2p direct |
| `TRADE_RESULT` | Executor → Collective | libp2p stream |
| `RISK_ALERT` | Risk → All | libp2p pub/sub |
| `HEARTBEAT` | Any → Registry | libp2p + on-chain |

---

*End of Technical Specification*
