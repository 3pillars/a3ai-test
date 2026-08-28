# Weekly Research Findings — 2026-08-28

## 1. Quant Finance / Monte Carlo
- MC simulation remains the standard tool to stress-test strategies before risking capital: generates thousands of permutations of a trade sequence to map the *distribution* of drawdowns (median vs. 95th/99th percentile vs. worst case).
- Industry benchmark (2024–2026): ~1,000 sims for stable median/5th-percentile estimates; 5,000–10,000 for tail-risk (99th pct drawdown).
- Primary use: overfitting detection. If a backtest's edge collapses under reshuffling, it was curve-fit.
- Renaissance, Two Sigma use MC-style sims extensively for risk.
- **Actionable:** Before deploying any automated strategy for the $5k/mo passive goal, run 5k+ MC sims and size positions to the 95th-percentile drawdown, not the average.

## 2. AI Agents / LLMs
- Agentic AI + persistent memory + real-world tool use accelerating into Q4 2026. Known weakness: agents still reactive, weak at proactive/goal-continuity behavior.
- Model Context Protocol (MCP) shipped major RC — becoming the enterprise standard for brokering agent access to production systems.
- 14 new models in Aug 2026 from 8 providers (latest: GLM-5.3 Flash, Aug 26). Llama 4 Scout: 10M-token context (iRoPE attention).
- Microsoft Agent Lightning v1.0 (Aug 17): open-source RL framework to train agents without changing existing code/tools.
- Cloudflare Kitesurf: cloud browser purpose-built for agents (cheaper than Chromium).
- Safety: OpenAI deliberately slowed its internal "Astra" model after it crossed a "critical cybersecurity threshold" (could autonomously attack hardened systems).

## 3. Bitcoin / Crypto
- **Data conflicts across cached sources** — range $64k–$80k. Most recent (Aug 25–28) daily analysis: violent late-August rally, BTC back above $70k (first time since late May), spiking to ~$77.5k–$80.9k.
- Catalyst: Aug 25 Treasury bond buyback event → massive short squeeze, >$1.25B in short liquidations. Also Trump's push for the CLARITY Act.
- Context: peaked ~$126k in Oct 2025, spent first 8 months of 2026 in a ~50% drawdown, then this rally.
- Fear & Greed Index at 70 ("Greed"). BTC dominance ~58%. Total crypto mcap ~$2.8T.
- Macro still restrictive; recovery vs. range-bound hinges on Fed rates vs. improving dollar liquidity.
- **Actionable:** This is a short-squeeze-driven spike, not confirmed trend reversal. "Greed" at 70 after a violent +18%/48h move = poor risk/reward for fresh longs. Jacob's $60k–$80k alert band is squarely in play — treat $80k as a zone to trim/take profit, not chase.

## 4. Economy / Investment Strategy
- Fed held at 3.50%–3.75%. Market flipped from expecting 2026 cuts to pricing *possible hikes* by year-end; baseline = pause. Trough rate ~3% if cuts resume.
- Drivers: core inflation above 2%, tariff shock (highest since 1930s), Iran/energy price shock. Tariff pressure expected to wane after Q1 2026.
- Economy resilient but growth uneven. Labor market near max employment.
- Fixed income 2026: returns driven by *income*, not price appreciation (rangebound yields). Higher-yield options (HY, EM, bank loans, CLOs) tempting BUT leveraged credit under stress — rising defaults + payment-in-kind activity = warning sign for low-rated issuers.
- **Actionable:** Favor quality/income. Investment-grade bonds have strong technicals; avoid reaching for yield in junk/CLOs given credit stress. Keep dry powder — rate path is a coin flip and an oil shock could force hikes.

## Cross-cutting takeaways for Jacob
1. Don't chase the BTC squeeze at $77–80k; it's your alert zone — plan to take profit, not add.
2. If building the automated trading system, MC-stress-test to tail-risk drawdowns before going live.
3. Macro is restrictive & uncertain (hike risk > cut certainty) — hold quality, keep cash reserves for a family of 6.
4. Avoid junk-credit yield traps; leveraged credit is cracking.
