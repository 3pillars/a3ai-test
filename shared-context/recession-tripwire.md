# Recession Tripwire — Consumer Credit Stress

**Purpose:** Early-warning on US consumer breakdown → recession leg. Catch the regime shift on data, not on headlines.
**Cadence:** Weekly review (heartbeat surfaces it). Hard data updates quarterly (NY Fed) / monthly (jobs, delinquency proxies).
**Created:** 2026-08-11, off the NY Fed Q2 2026 Household Debt & Credit report.

## Baseline (VERIFIED against NY Fed Q2 2026 release + Liberty St Economics, Aug 2026)
- Credit card debt: **$1.26T** (+$21B in Q2). Record $1.28T = Q4 2025. ✅
- Total household debt: **$18.8T** — actually *dipped* $13B (−0.1%) in Q2. ✅ (headline "rise" is the card line, not the total)
- Auto loans: **$1.71T** (+$28B, record high). ✅
- Mortgages: **$13.1T** (−$74B). HELOC: **$459B** (+$13B). Student: **$1.65T** (−$7B). ✅
- **Card 90+ STOCK delinquency (share of balances): ~12.8%** (up from 7.6% Q3 2022). GFC peak ~13.7%. ⚠️ **CAVEAT — see below.**
- **Card delinquency FLOW (transition rate into 90+): elevated but ~flat since 2024.** ← the honest signal.
- **Subprime auto 60+ delinquency: 5.67% (June 2026), DOWN 64bps YoY** — the January seasonal peak was a record 6.90%, but the rate has since improved and is running BELOW year-over-year levels. **Plateauing AND now easing** — not accelerating. Prime auto: 0.37% (benign; GFC prime peak was 0.9%). All auto/leases 60+: 1.42% (June, Equifax).
- July jobs: **−23,000** (expected a gain) — labor market turning. ← freshest real catalyst.
- NY Fed framing: **"K-shaped" divide** — stress concentrated in lower-income/paycheck-to-paycheck households, not evenly spread.
- Sources: [NY Fed release](https://www.newyorkfed.org/microeconomics/hhdc), [Liberty St Economics — reconciling delinquency measures](https://libertystreeteconomics.newyorkfed.org/2026/08/how-distressed-are-consumers-reconciling-diverging-credit-card-delinquency-measures/), [Wolf Street — state of Americans' auto debt (Aug 13 2026; latest subprime/prime 60+ readings)](https://wolfstreet.com/2026/08/13/the-state-of-americans-auto-debt), [Wolf Street auto Q1](https://wolfstreet.com/2026/05/19/auto-loan-balances-debt-to-income-ratio-and-delinquencies-of-subprime-prime-auto-loans-in-q1-2026-how-bad-is-it/), [The Hill](https://thehill.com/business/5901953-credit-card-balances-record-high-late-payments-new-york-fed/).

### ⚠️ Canonical source for the subprime auto 60+ leg (resolved 2026-11-01)
- **This is NOT a FRED series.** `CASSVAO`, `DRALACBS60`, `DRALACBSA60`, `SUBPRIME60`, `DRASUBPRIME` all **404 on FRED**. `DRALACBS` = "Delinquency Rate on All Loans, All Commercial Banks" (1.42%, 2026-04-01) — a DIFFERENT metric (bank-level, all loans); **do not substitute it**.
- **Canonical source = Fitch Ratings**, the ABS rating agency: 60+ day delinquency rate on **subprime auto loans securitized into ABS**. Fitch publishes it monthly; Wolf Street republishes it with the chart. Read it from the latest Wolf Street "state of Americans' auto debt" / quarterly auto-loan article.
- Fetch path that works: `curl -sSL "https://r.jina.ai/https://wolfstreet.com/<slug>"` then grep for `60-day-plus delinquency rate of subprime`.
- **Latest read (Wolf Street, Aug 13 2026, June 2026 data): subprime 60+ = 5.67%, −64bps YoY. Prime 60+ = 0.37%. All auto/leases 60+ = 1.42% (Equifax).**
- Cadence: monthly. Do not burn a heartbeat trying to re-verify it weekly — it cannot move fast, and the tripwire is a *re-acceleration* test (>7%), not a level test.
- For reference, the NY Fed HHD_C quarterly xlsx (`HHD_C_Report_<YEAR>Q<N>.xlsx`) covers ALL auto loans by age/loan type but **has no subprime credit-score cut** — its "Transition into Serious Delinquency (90+) for Auto Loans by Age" (Page 26) is an AGE split, not a credit-score split. Do not confuse the two.

## ⚠️ Metric correction (why the scary number lies)
The NY Fed's OWN research (Liberty St Economics, Aug 2026) says the **12.8% stock rate overstates distress** — it's inflated by charged-off debt sitting on books LONGER, not by more people newly falling behind. The **flow (transition) rate is the accurate real-time gauge, and it's been ~flat since 2024.** So "12.8% approaching 13.7% GFC peak" is a lagging, contaminated signal. **Trigger on flow, not stock.**

## Watchlist + trigger thresholds
| Metric | Source | Alert if | Priority |
|---|---|---|---|
| **Card delinquency FLOW / transition into 90+** | NY Fed HHDC (quarterly) | **breaks out of its ~2yr flat range** ← primary card signal | 🔴 HIGH |
| Nonfarm payrolls | BLS monthly | **2nd consecutive negative print** (Jul was −23k) | 🔴 HIGH |
| Subprime auto 60+ delinquency | **Fitch Ratings** (60+ day delinquency on subprime auto ABS), republished monthly by Wolf Street | **re-accelerates / breaks decisively >7%** (Jan 2026 seasonal peak was a record 6.90%, but June 2026 was 5.67%, −64bps YoY and BELOW prior-year levels — "new high" alone = noise) | 🟡 MED |
| Continuing jobless claims | DOL weekly | sustained > ~1.95M and rising | 🟡 MED |
| Auto repossession rate | Cox Automotive | rising m/m | 🟡 MED |
| Revolving credit growth | Fed G.19 | rolls negative (consumer tapped out) | 🟡 MED |
| ~~Card 90+ STOCK delinquency~~ | ~~NY Fed HHDC~~ | **DEMOTED** — contaminated by charge-off reporting lag; context only, not a trigger | ⚪ WATCH |

## Interpretation
- Delinquencies = **old debt going bad** (per NY Fed) → stress already baked in, not just starting.
- Card balance is half spending / half inflation — not a "confident consumer" signal.
- Fed boxed: oil-driven inflation says hike, dying jobs + drowning consumer say cut. Stagflation corner.

## Portfolio linkage (Jacob)
- Confirms stagflation base case (S&P -10 to -20%, oil $100-130, BTC floor ~$60-70k).
- Debt-erosion-by-inflation is structurally bullish the BTC / hard-asset hedge on a 10-yr horizon.
- Short-term: risk-off bleeds into crypto (compounded by Iran tape).

## Status
- ✅ Figures re-verified live against NY Fed Q2 2026 release (Aug 11 2026). All balances confirmed exact.
- Weekly surfacing is via HEARTBEAT.md. Web access (WebSearch/WebFetch) now works in-session — next quarterly NY Fed drop can be pulled live for hard numbers.
