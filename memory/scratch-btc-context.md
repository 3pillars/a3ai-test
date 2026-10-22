# SCRATCH — Live Market Context (Updated Oct 22, 2026 11:20 PDT)

## BTC Status (Oct 22, 2026 11:20 PDT)
- **CURRENT: ~$81,037** (CoinGecko live, −4.3% 24h)
- **Trade: LONG from Aug 22 @ ~$77.4K** — INTACT ✅
- **FLUSH TRIGGER: $74K** — $7,037 / 8.7% below current. Well above trigger.
- **INVALIDATION: $70K** — daily close below = stop / flip-to-caution. 13.6% below current.
- **$85K profit tag: APPROACHING, NOT crossed** — today's high was $84,778 (0.26% under the tag). Was ~$84.1K high earlier today — this is a fresh near-tag, watch into the close.
- **$86K critical inflection** — 1.4% above today's high, also approaching.
- **BTC dominance 59.47%** · total mcap $2.73T · ETH $2,374 (−5.7%)

## Live Cross-Asset (Oct 22, 11:20 PDT, CNBC quote API)
- **SPX 7,652.75 (−1.35%)** · **IXIC 26,006.69 (−2.61%)** · DJI 52,785 (−0.13%) — risk-off session
- **VIX 19.37 (+16.1%)** · **MOVE 104.49 (+8.91%)** — vol bid
- **Gold $4,057.40 (−2.23%)**
- **HYG $77.055 (+0.10%)** · **LQD $104.365 (+1.12%)** — credit calm, duration bid
- **HY OAS 327bps (Oct 21)** vs +75–100bps/2wk sentinel threshold → **not tripped** (Oct 6→21 was only +24bps). Slow grind, not a spike.
- **Canaries:** CRWV $55.11 (−10.9%) · NBIS $156.80 (−8.6%) · META $645.37 (−7.5%) · ORCL $123.48 (−4.4%) · NVDA $212.67 (−4.2%)

## Oil (Oct 22, 11:20 PDT)
- **Brent front-month $113.08** (+3.91%) — CNBC `@LCO.1` = ICE Brent Dec'26
- **WTI $99.48** (+2.40%) — CNBC `@CL.1`. **Brent–WTI spread ~$13.60** (route premium, not demand)
- Five-month high (Reuters/Guardian). Was $94.07 three months ago (+20.2%).
- **REPRICING TRIGGER: Brent >$126.10 (52wH, FRONT-MONTH FUTURES)** → +11.5% away
- ⚠️ **DO NOT use FRED `DCOILBRENTEU` (spot) for this trigger.** It prints >$126 on six October sessions (Oct 2: $135.51) that never happened in the traded contract. FRED's own 52w spot high is $138.21 (Apr 7 wartime peak) — a different series from the $126.10 futures anchor.

## US-Iran — ESCALATION (updated Oct 22)
- 7 oil tankers attacked/damaged in the Strait of Hormuz (AP/The Hill/CBC)
- Houthi strike on a Saudi airport kills 2; Saudis intercepting drones; US tells diplomats to leave
- Iran threatens oil AND AI facilities across seven Gulf countries
- **STRIKE WINDOW DATE-CONFIRMED: EARLY NOVEMBER** (NPR Oct 22 + NYT Oct 21 + FT Oct 21) — post-Nov 3 midterms
- Netanyahu ordered IDF + Mossad to topple the regime — **regime-change doctrine**
- Iran's floating oil reserves depleted; shadow-tanker fleet out of oil (WSJ)
- **The Oct 21 read ("Trump blocked Netanyahu's offensive → oil de-rating") was WRONG — reversed Oct 22.**
- Next catalysts: early-Nov strike window; Oct CPI mid-Nov; regime-change execution risk

## Sentiment / Melt-up (NOT TRIGGERED)
- **VIX 19.37** (trigger <15 — ~23% above) · **F&G 68 Greed** (not Extreme Greed) · **AAII Oct 21: bull 36.9 / bear 45.8 = −8.9 net bearish**
- Trigger requires VIX<15 + Extreme Greed simultaneously. Nowhere near.

## STX / sBTC Watch (WATCH only — not a Jacob position)
- **STX $0.3276** (−13.8% 24h, badly underperforming) → **404 sats** = `$0.3276 / $81,037 * 1e8` (was 441 Oct 21) = **2.5x from the 1,000-sat trigger, moving the wrong way.** Baseline 290 sats.
- **sBTC TVL $201.36M** = **5.0x from the $1B trigger.**
- No Binance STX delisting (Google News 7d: zero fresh items).

## FLOP Labs Kibble — WATCH
- **ORCHESTRATOR TRIPWIRE:** `~/flop_agent/FLOP_TRIGGER.flag` — **absent** ✅ (also `FLOP_QUALIFICATION_TRIGGER.flag` absent)
- Keepalive last SUMMARY **2026-10-22T16:05:18Z overall=OK** (1.8h old, well inside 36h rule)
- DID active ✅ — `did:key:z6MkgAKzLRhJ5mU5t1GTRymXWexD4eR4V8jRy9` (did-88/12fa839a6de69f)
- Journal posted 6 today, verify_did=True. Watch version 0.14.5 (no change).
- Airdrop starts late October. **Yellowpaper Issue #133 ambiguity still open** — technocore.chat chat activity may NOT count toward the airdrop (only settled compute purchases).

## Coinbase Premium (read-only, no state write)
- CEX premium **−0.1173%** (neutral) · DEX premium **−0.2857%** (negative). No US demand bid.

## Automation Health
All crons `ok`. Heartbeat running. No failures, no silent repeats.

## Tooling Notes (new this cycle)
- **Yahoo Finance is fully degraded** (Oct 22, 11:20): `query1`/`query2` chart API returns `Edge: Too Many Requests` on EVERY symbol, even with a browser UA. `sources.md` says the UA fixes it — true at last check, **false now**.
- **CNBC quote API has NO `data` wrapper**: live path is `json["QuickQuoteResult"]["QuickQuote"][0]`, not `data["QuickQuoteResult"]...`. The skill's documented path raises KeyError.
- CNBC symbols that work: `.VIX` `.SPX` `.DJI` `.IXIC` `.MOVE` `@CL.1` `@GC.1` `@LCO.1` (Brent front-month) `HYG` `LQD` `META` `CRWV` `ORCL` `NVDA` `NBIS`.
- **Stooq is dead** (JS proof-of-work challenge) — already noted in sources.md, confirmed again.
- **FRED `graph/fredgraph.csv` remains reliable** — used for Brent spot, VIXCLS, HY OAS, payrolls.

## Disk Alerts (All Confirmed Safe — NO ACTION NEEDED)
- /dev/disk3s5 (Data volume): 47% full — NOT an issue
- /dev/disk5s1 (Decrediton volume): 82% full — Decred daemon running since Aug 5, leave it
- map auto_home: 100% reported — APFS snapshot quirk, actual Data volume 47% full
