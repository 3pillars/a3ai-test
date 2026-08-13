# Bitcoin On-Chain Metrics — Aug 13, 2026

**Pulled:** 2026-08-13 ~00:44 PDT | **Worker:** on-chain (subagent)
**web_search status:** ✅ WORKED (Gemini 2.5 Flash provider; 8 queries, 0 hard failures)

> Caveat: Aug 13, 2026 is a Wednesday in the early hours PDT — most ETF "today" flows
> haven't published yet (US market not open). Metrics below reflect the latest
> available snapshot, with explicit dates.

---

## 1. SOPR (Spent Output Profit Ratio)

- **Value:** ~1.00 (aggregated); STH-SOPR 0.997 (Aug 11); STH 0.998 / aggregated 0.980 (Aug 7)
- **Source:** Glassnode / MacroMicro / Bitbo (via web_search)
- **Interpretation:** **NEUTRAL / breakeven zone.** Hovers at 1.0 — neither profit-taking nor capitulation. Slight sub-1 reads on short-term holders suggest the market is digesting recent losses without forced selling. Historically this is a "wait and see" zone, not a buy/sell trigger.

---

## 2. MVRV Z-Score

- **Value:** ~0.37 – 0.41 (Aug 9 reading 0.41; 30-day avg/median 0.37)
- **Source:** Glassnode (cited by FXStreet + Bitbo Charts)
- **Interpretation:** **UNDERVALUED.** Below 0.5 = historically a value/accumulation zone. Far below the 3.5 euphoric threshold and well above the deep-bottom negative zone. Combined with STH-SOPR ≈ 1, this is "cheap on-chain, no panic" territory.

---

## 3. ETF Net Flow Trend

- **Last 7 days (week ending Aug 7):** **+$853.54M net inflow** (CoinGlass); SoSoValue shows ~$1.03B over 5 sessions Aug 3–7. IBIT captured ~80% (~$690–693M).
- **Last 3 days direction:** **REVERSED.** Aug 10 saw **−$144.6M net outflow** ending a 5-day inflow streak; Aug 11 saw **−2,209 BTC outflow** (~$144M equivalent) per Binance/CoinSquare data. Aug 12–13 not yet published at pull time.
- **Source:** CoinGlass, SoSoValue (per 99bitcoins, KuCoin, TradingView)
- **Interpretation:** **NEUTRAL-to-CAUTIOUS.** Strong week overall, but momentum has flipped to outflows in the last 3 sessions. Watch for either continuation (distribution risk) or re-acceleration of inflows.

---

## 4. Puell Multiple

- **Value:** ~0.83 (as of Aug 7, 2026 — latest verifiable; Aug 12 chart data not numerically reported in search results)
- **Source:** MacroMicro / CryptoQuant / LookIntoBitcoin (via web_search)
- **Interpretation:** **NEUTRAL-to-UNDERVALUED.** Below 1 = miner revenue below its 365-day MA, signaling compressed miner profitability. Not yet in the deep-accumulation green zone (<0.5), but no longer in overheated territory. Consistent with the MVRV-ZS read.

---

## 5. Open Interest (BTC futures)

- **OKX BTC futures OI:** **$2.606B USD notional** (Aug 12, 2026, 01:00:22 UTC) ✅ units confirmed (USD)
- **Total BTC futures OI (all exchanges):** **~$47.0–47.56B USD** (Aug 12, per Coinglass via coingape)
- **Total crypto OI:** $116.23B (context)
- **Source:** bitcoinfuturesinfo.com (OKX), coinglass.com (aggregate)
- **Interpretation:** **NEUTRAL.** OKX print is right in the normal $2B band you flagged as the sanity check. Aggregate $47B is mid-range historically — neither squeezed nor euphoric. No leverage blow-off top or wash-out bottom signature.

---

## Summary Table

| Metric | Reading | Zone |
|---|---|---|
| SOPR | ~1.00 | Neutral |
| MVRV Z-Score | 0.37–0.41 | **Undervalued** |
| ETF flows (7d / 3d) | +$854M / flipped to outflow | Neutral → cautious |
| Puell Multiple | 0.83 | Neutral → undervalued |
| Open Interest | OKX $2.6B / Total $47B | Neutral |

**Composite read:** Mildly **undervalued on-chain** (MVRV-ZS + Puell) with **neutral-to-cautious** flow/derivatives signals. Not a screaming buy, not a top. Lean accumulation, watch ETF flow re-acceleration as the next catalyst.

---

## File metadata

- **Path:** `/Users/changjieyang/.openclaw/workspace/shared-context/test-onchain.md`
- **Status:** Written (overwrite confirmed)
- **web_search:** ✅ Functional — Gemini 2.5 Flash returned data for all 5 queries
- **Farside fetch:** Avoided as instructed (Cloudflare-403)
- **SoSoValue / Coinglass:** Sourced via secondary aggregators (99bitcoins, KuCoin news, coingape) — direct sites were not fetched