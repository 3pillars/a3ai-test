# AI-Capex → Private-Credit Sentinel

**Purpose:** Early-warning on the Myrmikan transmission chain — AI-infrastructure debt → private credit → thin-cushion insurers. This is the *institutional* credit sentinel. (Consumer-side stress lives in `recession-tripwire.md` — do not duplicate.)
**Why it exists:** If the AI-capex bubble cracks, the sequence is **deflation → then reflation**. Credit spreads widen *before* equities break. This sentinel is meant to give weeks-to-months of warning so cash gets deployed at the pivot, not early.
**Cadence:** Weekly (Sunday). Alert only on regime change, not on levels.
**Created:** 2026-08-15, off the Myrmikan Aug 14 2026 report + Jacob's positioning question.

## The chain being watched (Myrmikan thesis)
Circular financing (Nvidia → neoclouds → Nvidia) inflates apparent demand → GPUs (3–5yr life) financed with long-dated debt / $1T+ lease commitments → PE (Apollo/Blackstone/KKR) packages the paper into ABS → parked in life insurers with ~4% equity cushions. A credit freeze or redemption wave = 2008-AIG-style run. **The structural timer is the 2027–2028 refi wall; the real-time signal is credit spreads.**

## Watchlist + trigger thresholds (institutional — spreads lead equities)
| Signal | What to check | ALERT if | Priority |
|---|---|---|---|
| **HY credit spreads (OAS)** | ICE BofA US High Yield OAS; HYG/JNK behavior | widens **>+75–100bps over ~2 weeks** off recent base | 🔴 HIGH — earliest real signal |
| **Private-credit / BDC health** | Big BDCs (ARCC, BXSL, BLUE) & BIZD — discount to NAV, dividend cuts, rising non-accruals | persistent **discount to NAV opens** or non-accruals jump | 🔴 HIGH |
| **Neocloud fragile tier** | CoreWeave (CRWV), Nebius (NBIS) — equity breakdown, debt downgrade, refi/covenant scare | any **debt downgrade, missed raise, or refi scare** | 🔴 HIGH — canary breaks first |
| **IG spreads / MOVE** | LQD, IG OAS, MOVE index | IG OAS widening **with** MOVE spiking (funding stress) | 🟡 MED |
| **Semis on AI-revenue scrutiny** | SMH/NVDA, hyperscaler capex-vs-ROI headlines | *persistent, spreads-led* selloff (not a one-day dip) | 🟡 MED — pre-signal, already flickering Aug 2026 |
| **Leveraged loan index** | SRLN / S&P LSTA, CLO spreads | breaks lower / CLO spreads gap wider | 🟡 MED |
| **The pivot itself** | Fed cuts into weakness + balance-sheet expansion | = **GREEN LIGHT to deploy dry powder**, not a warning | 🟢 ACTION |

## Interpretation rules
- **Spreads lead. Equities lag.** If equities wobble but spreads are calm → noise. If spreads widen while equities look fine → *that* is the tell.
- **Two tiers, don't blur them:** neoclouds (CRWV/NBIS) are fragile and break first; hyperscalers (MSFT/GOOG/AMZN) have real cash flow and survive. A neocloud scare ≠ systemic yet, but it's the canary.
- **Regime change, not levels.** A high-but-flat spread is not a trigger (same discipline as the consumer card-delinquency stock-vs-flow correction). Alert on the *break*, not the absolute number.

## Portfolio linkage (Jacob) — see full logic in chat 2026-08-15
- Phase 1 (unwind): cash is the position; BTC satellite light + un-levered; physical gold held *through*; don't short.
- Phase 2 (reflation): deploy dry powder into hard assets **on the Fed pivot**, not before.
- Being early = being wrong. This sentinel exists so timing is *observed*, not guessed.

## Status log (cron appends newest at top)
- 2026-08-16 — ALL QUIET (no new break). **Systemic calm:** HY OAS **271bps** (Aug 12) = flat vs 270 baseline, pinned at cycle tights; MOVE **~70**, no funding stress; lev-loan/CLO spreads near historic tights, no gap wider (CLO mkt >$1.5T, $101B Q1 issuance — demand intact). **BDCs healthy/improving:** ARCC 2.4% non-accrual (below ~3% norm), only 3% discount to NAV, $0.47 core EPS; BXSL non-accruals *fell* 3.1%→1.8%, no new non-accruals, div coverage 97%, ~2.8% NAV dip is mark-to-mkt not credit. **Neocloud = still the soft spot but NOT a fresh break:** the violent late-July repricing (CRWV CDS ~855bps ≈ 50% 5yr default odds, CRWV/NBIS -36%/-43% on the month) is the *same episode already logged Aug 15*, not new this week. CRWV ~$105 (Aug 14) roughly flat wk-over-wk; only new item is HSBC price-target cut flagging funding needs / rising debt costs = equity-analyst valuation call, not a debt downgrade or refi failure (same category as last week's NBIS DA Davidson cut). No 🔴 tripped; spreads-led systemic stress absent. Canary flickered hard in July, hasn't made a new low. Baseline holds: HY OAS ~270, MOVE ~70.
- 2026-08-15 — ALL QUIET (first live run, no baseline break). **HY OAS 271bps** (Aug 13; briefly spiked to 287 end-July, compressed back — pinned near cycle tights, no widening). **MOVE 69.6** (calm, no funding stress). **Neocloud canaries strengthening, not breaking:** CRWV +18% on Q2 beat, closed oversubscribed $2.6B term loan (Ba2/BB+, 2031, in-line for tier); NBIS +30% on 5x rev growth, defied Burry short — DA Davidson cut to Neutral but that's valuation, not credit. **BDCs healthy:** ARCC 2.4% non-accrual at cost (below 3% norm), +4.3% premium to NAV; BXSL non-accruals *fell* 3.1%→1.8%, ~3% discount; BIZD ~flat to NAV. No signal tripped; spreads-led stress absent. Baseline set: HY OAS ~270, MOVE ~70.
- 2026-08-15 — Sentinel created. Baseline TBD on first run. Known pre-signal already live: "selective profit-taking in semis on AI-revenue scrutiny" (Aug 15 headlines) — watch, not trigger.
