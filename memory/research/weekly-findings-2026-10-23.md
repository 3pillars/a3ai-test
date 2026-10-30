# Weekly Research Findings

**Week of October 23, 2026** (compiled Fri Oct 23, 2026, 08:05 PT)

---

## 1. Quantitative Finance / Trading / Monte Carlo Simulation

### The Big Story: An AI-led hedge fund drawdown week
- **Global hedge funds were hammered by the AI/tech selloff** — weekly returns worsened, Asia managers led losses (Reuters, Oct 23). Widest daily drawdown since Covid in the rout (Bloomberg).
- **Hedge funds cut tech stocks at a record pace**; Goldman reports hedge fund **short bets near five-year highs** and warns of a **squeeze risk** if the AI trade reverses hard.
- **Top 100 hedge funds lagged the broader sector in H1 2026** — the first time the leaderboard has been that disjointed from index returns (Hedge Fund Alpha / InvestmentNews).
- **Arini (London credit fund): YTD losses >21%** on distressed-debt bets; "up to 100 people out" in the London macro/credit complex. "Quant Quake" framing (EBC): a hedge fund crash without a market crash.
- **Schwab CEO Rick Wurster on agentic trading:** *"an AI agent should only trade on your behalf if you give them the rules of the road"* — handing over the keys is "a leap too far." Schwab launches **Charley**, an assistant that is explicitly *not* an agentic trading bot (Q3: adj. EPS +29% to $1.69, record $7.17B revenue, record $190.4B core net new assets).
- **Democrats are pressing the SEC over AI trading agent oversight** (CoinMarketCap) — the first real regulatory push on autonomous retail execution.

### Structural / flow news
- **J.P. Morgan raised its long-term hedge fund return forecast to 6.7%** and released 2027 LTCMA: **7.0% for 60/40 over 10–15 years**.
- **AQR brought its factor-based alternatives to UCITS** via a new market-neutral fund.
- **WisdomTree launched 2 long/short ETFs on the Texas Stock Exchange** — hedge-fund-style strategies to retail.
- **Chinese quant fund Lingjun attracted $300M+ from overseas investors** (Reuters) — mainland quant shops are still exporting capacity.
- **Rebellion Research:** point-in-time integrity, backtesting hygiene, and verifiable signals are becoming the buying criterion in quant investing. **Exa's Snapshot** now replays the 100-billion-document web as of any past date specifically to remove future leakage from agent backtests. **RavenPack launched a Nemotron-powered backtest-ready dataset pipeline.**

### New research (arXiv q-fin, last 7 days) — high signal
| Paper | Core insight |
|---|---|
| 2610.24544 — Rachev-Ratio Portfolio Optimization with TimeGAN | **Generative scenario caveat:** TimeGAN scenarios **understate volatility and tail losses** and distort cross-asset dependence; more training improves reconstruction loss but *not* correlation accuracy. Hybrid (historical + generated) policies earned better average net returns, but every conditional generated-vs-historical return interval **includes zero**. Direct lesson: don't replace history with synthetic paths in tail-sensitive allocation. |
| 2610.23749 — From Alpha to Execution (concave impact + Hurst) | Execution horizon should be chosen to **maximize the realized Sharpe of the trade, not minimize cost**. Under concave power-law impact, slower execution lowers variance *and* can lower cost per share. Urgency comes only from alpha realized while the order works. |
| 2610.24558 — Optimal Trading Filters and the Value of Predictive Signals | Wiener–Hopf factorization gives the optimal stationary policy as **conditional forecast ∘ explicit causal linear filter**; recovers the Gârleanu–Pedersen aim-portfolio under exponential resilience, and needs memory beyond finite-dim LQR under power-law decay. **Equal-accuracy signals can have different trading value** — actionability, not accuracy, is priced. |
| 2610.30564 — When News Gets Old (LLM + RL portfolios) | Aging news signals: giving an RL policy news *timing* information produced **no consistent benefit**. For LLM portfolio selection, **filtering out stale news gave the best net return — 18.43%/yr** with a 4-week delivery delay. |
| 2610.30557 — Steward: Governed Self-Evolution for Autonomous Investing | Nine role-specialized agents (4 analysts → Portfolio Manager → protected Risk Manager), a 7-layer shared memory assembled from the system's own record, and code-graded self-review. Every action irreversible, every input untrusted web content. |
| 2610.22745 — Reading the News Without Hindsight (NoLBERT) | Encoder pretrained only on 1976–1995 text, contrastively fine-tuned, used to forecast S&P 1000 returns across 3 rebalancing frequencies — **removes hindsight leakage** from news-based backtests. |
| 2610.27751 — Regime-Aware NCO Tactical Allocation | Gaussian **HMM regime detection fitted only on data available up to each decision point**, injected into covariance estimation, hierarchical clustering, and weight optimization. |
| 2610.26456 — RegimeRank sector rotation | Ranking sectors by expected forward risk-adjusted active performance, with interpretable signal characteristics and macro-regime-conditioned signal relevance. |
| 2610.31074 — Directionally Correct Views in Portfolio Optimization | Black-Litterman-inspired: **even a small amount of directionally correct expert information materially improves allocation**, and a simple Markowitz model matches an end-to-end model. |
| 2610.26919 — Dynamic portfolio selection under Range VaR | Continuous-time mean–RVaR reduced to a static quantile problem via convex envelope. |
| 2610.29663 — Lineage-Aware Search Control for LLM Factor Mining | LLM evolutionary factor mining collapses around structurally similar factors; adding **lineage-level** (ancestry) control re-directs the search. |
| 2610.23517 — Combinatorial Arbitrage in Prediction Markets | Recovered 1.9M logical relations across 255,000+ contracts, replayed full-depth Polymarket books; prices outside the convex hull of admissible payoff vectors admit arbitrage, portfolios solved via integer programming. |
| 2610.28847 / 2610.25671 | DSINC beyond Heston (3/2 and other non-affine stochastic vols); arbitrage-free implied-vol surface reconstruction via additive martingales. |

**Takeaway for the desk:** the week's quant literature is unified on one theme — **honest backtesting and execution realism dominate model cleverness**. Point-in-time integrity, leakage-free news encoders, synthetic-tail honesty, and impact-aware execution are the live frontier.

---

## 2. AI Agents / LLMs

### Infrastructure: llm-d 1.0 ships (CNCF sandbox; Red Hat, Google Cloud, IBM Research, CoreWeave, NVIDIA)
Distributed inference stack for Kubernetes, now production-ready with cache-aware routing, tiered KV-cache offload, prefill/decode disaggregation, wide expert-parallelism, priority controls, and zero-downtime upgrades for shared inference.
- **3× output throughput / 2× faster TTFT** vs round-robin routing (Llama 3.1 70B on 4× AMD MI300X)
- **Up to 70% higher tok/s** with prefill/decode disaggregation (GPT-OSS on NVIDIA B200, via AWS)
- **50k tok/s** cluster output throughput on a 16×16 B200 prefill/decode topology (wide-EP)
- **13.9× throughput improvement** with hierarchical KV offloading at 250 concurrent users (4× H100)
- **40% TTFT/ITL reduction** with predicted-latency scheduling vs heuristics (Google)
- Thesis: **AI's real bill is inference, not training** — routing/cache discipline is where margin now lives.

### Decision models become a category
- **OpenAI's Decisions API is now GA** — direct competitor to TypeSafe's Jev, with new voice and visual modalities, priced at **$0.10/1M input tokens and no output-token charge**. Super-classifier models that choose from an option set with a confidence rating are displacing LLMs in classification-heavy workflows at a fraction of cost.
- **Gemini 4 Argon** launched globally with ~1M-token context and a $2/$4 pricing tier; **Replit switched its default from Anthropic to OpenAI**; **Google Cloud now carries OpenAI models alongside Gemini and Claude** — the only major cloud with all three.
- Anthropic + Hg launching a European AI consultancy (end 2026); Anthropic + Theorem **formally verified security properties at assembly-code level across 123 open-source libraries**.

### Security: the week agentic offense went operational
- **Microsoft disclosed ARTEX** — an AI-driven, large-scale nation-state supply-chain campaign. China-aligned actors used AI agents to compromise ConnectWise and downstream MSPs, **attempting sign-ins at 2,250+ Microsoft 365 tenants, reaching privileged access in under three hours, with MFA not applying**. Also struck 80 Japanese firms and Korea's finance sector.
- **Autonomous "LLMjacking"** — a 'Skynet' agent hijacking exposed AI models to run attacks; separate reporting on hackers breaching 100+ company sites for a few thousand dollars using agent swarms.
- Counter-moves: **Red Hat + NVIDIA** building agent security controls agents cannot override; **JFrog AI-SEC** to control every agent/skill/model and close the shadow-AI gap on developer endpoints; AWS shipping **observability patterns for AI agents on EKS** and a production-grade **evaluation framework on Bedrock AgentCore**.
- **OpenAI donated the LLM API spec to the Agentic AI Foundation.**

### New research (arXiv cs.AI / q-fin.CP)
- **2610.31461 — Adaptive Skill Granularity for coding agents**: treats skill granularity as an *action-abstraction policy* conditioned on task structure — a coding agent may solve a task via primitive tool calls, a macro skill, or a hybrid macro→micro recovery path. Directly relevant to how OpenClaw skills are structured.
- **2610.31593 — Simulated Control Evals (SCEs)**: use an LM to simulate tool responses in place of a real environment, letting safeguard/control evaluations run on any task — evaluated on LinuxArena.
- **2610.31436 — Conservative Meta-Agent Search**: architecture adaptation under non-stationarity.
- **2610.31521 — Jev-DLC**: decision-level continual learning from typed feedback.
- **2610.31522** — auditing hidden future-token leakage in adaptive sequence models.

**Takeaway:** the agent stack is bifurcating into (a) *cheapest-possible decision models* for classification and (b) *inference-optimized serving* for generation — and the binding constraint has moved from capability to **security and governance**.

---

## 3. Bitcoin / Crypto Market Analysis

### Live snapshot (Fri Oct 23, 08:05 PT)
| Metric | Value |
|---|---|
| BTC | **$81,530** (−0.12% 24h) |
| BTC 30d range | $81,328 – $86,490 (**−3.4% over 30d**) |
| ETH | $2,400 (30d range $2,386 – $2,726) |
| SOL | $104.5 (30d range $103 – $122) |
| Total market cap | $2.745T (**−2.92% 24h**) |
| BTC dominance | **59.42%** / ETH dom 10.63% |
| 24h volume | $67.9B (30d avg $29.4B — volume is running hot) |
| Fear & Greed | **50 (Neutral)** — down from 68 (Greed) two days prior |
| OKX BTC-USDT-SWAP funding | **+0.00799%** (mildly positive; premium −0.043%) |
| OKX BTC-USDT-SWAP OI | 31,276 BTC ≈ **$2.55B** |
| US 10Y | 4.995% (was 5.146% mid-week) |
| Brent | ~$111 (spiked >$116 intraweek, 6-month high) |
| Nasdaq | 26,066 (down >2% intraweek) |
| VIX | 19.09 (from 16.68 pre-selloff) |
| Gold | $4,016 (−3.5% on the week) |

### Price action narrative
- BTC rallied to **$84,780 on Oct 21**, then **gave the entire move back** to $81,300 by Oct 23. **Holding above its 50-day average** but only just. The CoinDesk note: *"Bitcoin gives back its run at $85,000 as Tesla and Meta fail to calm AI nerves."*
- **BTC has decoupled from midterm-cycle bottom history** — prior bear-market lows all followed US midterms; this year's recovery suggests the bottom may have arrived months early (CoinDesk).
- **BTC realized volatility is now as jumpy as Nvidia's and ~8× the euro-dollar** — but CoinDesk notes daily swings are the **narrowest in 2.5 years**. Implied vol 38.3% vs realized 20.2% — a rich premium, and $80K put is the most-traded strike (Binance).
- **Traders are seeking shelter in BTC as alts slide** — DeFi index −6% on the AI-doubt day, memecoins led rebounds on green days, Zcash +11%.
- **Options expiry** on billions in notional is a near-term vol event; $80K put dominance signals downside hedging despite the rally.

### Structural / fundamental news
- **J.P. Morgan issued its first-ever long-term BTC return forecast: 10% annualized baseline**, beating stocks, bonds and gold — with a bull case of **$385,000 in 10 years** and a bear case of **$25,000**. The bank's own volatility warning is the "nasty catch." Critically: **JPMorgan still keeps BTC out of its portfolio models.**
- **Michael Saylor:** BTC's next bull run has begun, six figures within a year. **McGlone (Bloomberg) counter-cycle warning:** AI risk + ETF exhaustion + stock correlation + Fed hikes could force a **drawdown to $10,000**. The bull/bear gap is unusually wide.
- **Bitcoin Core changed its security policy** — dropping the months-long embargo for flaws an AI can trivially rediscover, and shipping fixes immediately, after a summer in which AI found hundreds of BTC bugs before humans did. Historic acknowledgment that **codebase triage itself is now an AI-augmented function**.
- **Mt. Gox pushed creditor repayments back to 2027** (sixth extension) — removes near-term supply overhang.
- **MSCI moving to drop Strategy (MSTR) from its indexes** — passive-flow risk for the leveraged BTC proxy.
- **Strategy spent 3× more on stock buybacks than on BTC in five weeks** — *who is actually accumulating?* MSTR just triggered a golden cross weeks after BTC did.
- **BlackRock is building a bitcoin shield** after a rival fund took a 50% drawdown; "bitcoin risk management" is now a product category.
- **SpaceX + Tesla merger talks confirmed**, with **SpaceX holding ~30,000 BTC** — a corporate-treasury bid that persists.
- **Fireblocks in talks with Visa for a ~$2.5B acquisition** (Axios) — custody consolidation into the card network.

### Regulatory / market structure
- **CFTC seeking comment on a framework to bring leveraged retail crypto onto regulated exchanges**; **Binance.US filed for CFTC prediction-market entry**; Polymarket's US return brings new retail competition; **Webull to debut crypto-linked perpetual futures in November**.
- **CLARITY Act stalled** — ~10% implied odds before midterms; JPMorgan says regulatory moves partly offset the failure but risks remain. White House crypto policy role still vacant.
- **OCC final rule restarting** on stablecoin rewards vs the GENIUS Act ban; **ABA says the OCC rules undermine Congress**. **France's parliament approved a 31% capital gains tax on stablecoin trades.**
- **Stablecoin push broadens:** **HSBC rolled its first stablecoin (HKDAP) to 3M+ everyday users** via Anchorpoint (HK's first issuer licenses, April); **Bank of Korea wants stablecoins written into forex law**; **Sweden's Riksbank revived the e-krona debate**.
- **Ethereum:** Glamsterdam test **delayed** after researchers showed new gas rules could let contracts permanently record failed operations; separate draft targets **4-minute finality** (4× faster settlement).
- **Solana wash-trading bot drove 23% of Raydium CLMM volume** (Bitquery) — quality-of-volume concern.
- **A16z is broadening beyond crypto into AI** — the classic crypto-native VC capital rotation is fully underway.

### Positioning read
- Structure is **defensive**: dominance rising to 59.4%, altcoins underperforming, funding flat-to-mildly-positive, OI steady at ~$2.55B (no leverage blow-off, no capitulation). Fear & Greed has cooled from 68 to 50 in two sessions.
- **Macro is the binding constraint**: Brent at a 6-month high (>~$111–116) keeps inflation risk live even as the 10Y dropped back under 5.00%, and gold fell hard alongside the AI-trade unwind. BTC is trading as a **levered AI/tech-beta asset right now**, not as a debasement hedge — the CoinDesk "decoupled from midterms" framing is not the same as decoupling from Nasdaq.
- **Tactical:** BTC is pinned between the 50-day MA (~$81,000) and the $84,800 recent high. Losing $80,000 puts the $80K put strike in play and reopens a test of $78K; reclaiming $85K needs AI equities to stabilize. Options expiry + the oil/Fed path are the two catalysts before month-end.
- **Structural bullishness intact:** whale accumulation, Mt. Gox overhang deferred to 2027, JPMorgan's 10% baseline, corporate treasuries (SpaceX 30k BTC), and a BlackRock risk-management product.

---

*Research compiled: October 23, 2026 — sources: CoinDesk RSS, Bitcoin Magazine RSS, Techmeme feed, Google News RSS, arXiv (q-fin.PM, q-fin.CP, cs.AI), CoinGecko API, OKX public API, Yahoo Finance chart API, alternative.me F&G.*
*Note: the configured `web_search` provider returned HTTP 403 (gemini provider); all findings were gathered via direct RSS/API fetches instead.*
