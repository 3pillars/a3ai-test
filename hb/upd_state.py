import json
p='memory/heartbeat-state.json'
d=json.load(open(p))
now="2026-11-17 01:40Z"
for k in list(d.get('lastChecks',{}).keys()):
    d['lastChecks'][k]=now
d['lastHeartbeat']="2026-11-17T01:40:00Z"
d['scratchFile']="memory/heartbeat-scratch-2026-11-17T0140Z.md"
d['updatedAt']="2026-11-17T01:40:00Z"
d['ais']={
 "concurrent":68,"transiting":68,"transitingTick":68,"strandedStatus":736,"strandedTick":736,
 "offshore":36,"staleFixes":309,"gapCarryover":4,"measuredPopulation":804,
 "gaps":24,"divergenceZero":True,"splitConverged":True,
 "note":("TRANSITS CONVERGED EXACTLY AT 68/68 ON BOTH ROUTES = 50% of the 136 median for a 2nd consecutive tick "
   "=> the traffic halving is CONFIRMED, not a counting artifact. Coverage slightly less clean this tick: aisGapCarryover "
   "1->4 and windowCoverage 99.9->99.4%, though stale fixes still fell 313->309. Verdict still 'closed / Effectively no'. "
   "tankerDarkRate still NULL for the 26th consecutive tick (prose 29.3% vs ambient 37.5% - prose only, evasion watch stays SUSPENDED). "
   "ambientDarkRate 37.5%, stratifiedZ -2.23, count 24 vs baseline7d 35.3, eligibleTankers 82, ambientEligible 800.")}
d['macro'].update({"gold":3848.80,"brent":91.98,"dxy":103.665,"us10y":5.135})
d['macro']['ratioLive']=0.7464007782101167
d['kalshi']={"T15":{"bid":0.96,"ask":0.97,"last":0.97,"oi":46589.13,"vol24h":4252.32,"bidSize":2263,"askSize":32639},
 "T20":{"bid":0.8,"ask":0.81,"last":0.83,"oi":14474.11,"vol24h":3466.49,"bidSize":9.01,"askSize":30},
 "T25":{"bid":0.12,"ask":0.15,"last":0.13,"oi":9655.96,"vol24h":2053.08,"bidSize":5202.93,"askSize":30.34},
 "T30":{"bid":0.01,"ask":0.02,"last":0.02,"oi":8066.56,"vol24h":366.58,"bidSize":14757.43,"askSize":9603.61},
 "T40":{"bid":0.0,"ask":0.01,"last":0.01,"oi":19744.05,"vol24h":0.0},
 "T50":{"bid":0.0,"ask":0.01,"last":0.01,"oi":32332.82,"vol24h":0.0},
 "note":("FROZEN AGAIN: no price moved on any leg and every v24 is identical to last tick. T20's book is still effectively "
   "empty (9 x 30) so the .83 last is noise. ONLY new information: T25 picked up a 5,202.93-contract BID BLOCK at .12 - "
   "someone loaded size on 'no, not above $25k'. That is a position, not a price. Kalshi still corroborates nothing.")}
d['manifold']={"warJan1_2027":0.7191833526404071,"warVolumeUsd":23854.38,"v24":257.01,"bettors":91,
 "note":"BYTE-IDENTICAL print to last tick (same prob to 16dp, same v24 257.01, same 91 bettors) => ZERO new flow in the window. Do not re-report as a fresh print."}
d['polymarket']['truce']={"Nov8":0.53,"Nov15":0.595,"Nov22":0.715,"Nov30":0.765,"Dec31":0.805}
d['polymarket']['israel']={"Nov15":0.9975,"Nov18":0.985,"Nov20":0.969,"Nov22":0.935,"Nov30":0.865,"Dec15":0.735,"Dec31":0.665}
d['polymarket']['wtiLadder']={
 "high90fromNov9":[0.40,0.43,32341],"high95":[0.16,0.18,36769],"high100fromNov2":[0.08,0.10,39071],
 "low85fromNov10":[0.999,1.00,31096],"low80":[0.52,0.53,31571],"low75":[0.17,0.19,44480]}
d['polymarket']['ukmtoCount']={"lt4":[0.01,0.08],"4_7":[0.32,0.58],"8_11":[0.31,0.57],"12_15":[0.07,0.32],"16plus":[0.027,0.112]}
d['polymarket']['notes']=[
 "CEASEFIRE CURVE ROLLED OVER ON THE FIRST PULLBACK: Dec-31 .83/.84 -> .80/.81 (-3c), Nov-8 .54/.55 -> .52/.54, Nov-30 ask -1c (bid +1c = tightened), Nov-15 ask -1c, Nov-22 .71/.72 HELD on a bigger book (62,247). Rollback is at the ENDS, not the middle.",
 "ISRAEL BOARD HELD AND DID NOT FOLLOW: Dec-31 .66/.67 unchanged with liq 213,216 (+9%), Dec-15 .73/.74, Nov-30 .86/.87, Nov-22 .93/.94 all unchanged, Nov-18 bid +0.3c => FIRST DIVERGENCE between the two ceasefire curves. If Israel Dec-31 breaks .65 next tick that is a genuine escalation read.",
 "WTI LADDER SPLIT: front upside legs kept sliding (HIGH $90-from-Nov-9 .40/.43, HIGH $95 bid .16) but the deep leg ROUND-TRIPPED (HIGH $100-from-Nov-2 .07/.08 -> .08/.10, BOTH UP) while downside rallied again (LOW $80 .52/.53 both +1c, LOW $75 bid +1c). $85-from-Nov-10 book -17% (37,284 -> 31,096) => the near-certainty print is thinning.",
 "AI-UNWIND BREADTH TRIPWIRE TRIGGERED: CRWV intraday low 48.59 broke the Nov-11 low 48.73 (closed back at 49.88); NBIS closed 107.13 with low 104.75, far below its Nov-11 regular low 134.00 and AH 148.47.",
 "GOLD NOT BIDDING: @GC.1 3,848.80, ~$51 below the $3,900 tripwire and FALLING again => the risk-off has no bullion bid; it is being traded as inflation/supply.",
 "IRAN RIAL SECOND PRINT EXACTLY FLAT (2,679,500, deltaDayPct +0.7047 identical) through the confirmed third tanker attack and Iran's six-sinking claim.",
 "IRAN CLAIM COUNT 4 -> 6 VESSELS SINKING (Yahoo/ABC/Al Arabiya/Seatrade/Malaymail), all attributed to Iran. UKMTO confirms attacks and one disabled vessel, NOT sinkings or mines - keep the claim attributed.",
 "UKMTO FILE UNCHANGED since last tick (33,893 bytes; identical entry list, only the URL lines differ). Still three UNNUMBERED 16 Nov entries, still NO 207-26. hb/news.py Google-News RSS returned HTTP 429 this tick - use web_search instead."]
d['stale']=[
 "dailyTransits (PortWatch) still dated 2026-11-08 - the Hormuz daily series has not advanced for the 58th tick",
 "crisisPressure inputsAsOf 2026-11-08 (8d stale)",
 "escalation inputsAsOf 2026-11-17T00:47:14Z - SAME input timestamp as last tick, so the 55 reading is LOCKED, not a fresh computation (22nd tick at 55/88)",
 "insurance + tradeImpact + carriers + pipelines feeds are curated and flagged figuresStale",
 "chokepoint (single) and cape feeds stale since 2026-08-28; the chokepoints rollup is live but dated 2026-11-08",
 "Aramco damage: still single source, body hijacked, no second carrier",
 "The UKMTO 16 Nov entries are UNNUMBERED, so notice-number-based boards lose their reference",
 "Vance-as-negotiator thread DORMANT, not resolved",
 "gog calendar events list returns a Google API 404 on this account - use 'gog calendar events --days=N'",
 "hb/news.py Google-News RSS is currently rate-limited (HTTP 429) - fall back to web_search / r.jina.ai",
 "Manifold print is byte-identical to last tick (zero flow) - do not quote it as a fresh print"]
d['lastTickDecision']=("01:40Z: THE CEASEFIRE ROLLED OVER AND THE ISRAEL BOARD DID NOT. US-Iran Dec-31 gave back 3c (.83/.84 -> .80/.81) with Nov-8 down 2c, "
 "while Israel Dec-31 HELD at .66/.67 and rebuilt depth (+9%) => first divergence between the two curves; if Israel follows down next tick it is a real escalation read. "
 "Meanwhile the WTI board SPLIT: front upside legs ($90-from-Nov-9 .40/.43, $95 bid .16) kept sliding, the deep leg ($100-from-Nov-2) round-tripped UP to .08/.10, "
 "and the downside ($80 .52/.53, $75 .17/.19) rallied again - the market has priced WTI in the low-to-mid 80s and is now arguing about the tail. "
 "AIS transits CONVERGED EXACTLY at 68/68 on both routes = 50% of the 136 median for a 2nd tick => the traffic halving is confirmed (coverage slightly less clean: carryover 1->4). "
 "CRWV's Nov-11 low is broken intraday (48.59) and NBIS closed 107.13 => the AI-unwind breadth tripwire is triggered. Gold at 3,848.80 is ~$51 below the 3,900 tripwire and FALLING, "
 "so there is no bullion bid on the selloff. UKMTO file unchanged, still no 207-26; rial printed a second time and was exactly flat at 2,679,500. "
 "Kalshi and Manifold printed NOTHING new (all v24 flat, Manifold byte-identical) => do not quote either as a signal. "
 "NEXT: does Israel Dec-31 break .65; does the $100-from-Nov-2 rebound continue; does AIS hold ~50% a 3rd tick; any tier-1 confirmation of Iran's six-sinking claim.")
d['notes'].append("01:40Z: The ceasefire curve rolled over on the first pullback (Dec-31 -3c) while the Israel board held flat on a bigger book - first divergence between the two ceasefire curves. "
 "WTI ladder split: $90/$95 slid, $100-from-Nov-2 round-tripped up, $80/$75 rallied again. AIS transits converged exactly at 68/68 (50% of median, 2nd tick). "
 "CRWV broke its Nov-11 low intraday (48.59) - AI-unwind breadth tripwire triggered. Gold 3,848.80, no bullion bid. UKMTO unchanged, no 207-26. "
 "Iran's claim count went 4 -> 6 vessels sinking (attributed). Rial flat for a second print. Kalshi/Manifold printed nothing new.")
d['notes']=d['notes'][-12:]
json.dump(d,open(p,'w'),indent=1,ensure_ascii=False)
print('state updated; notes len',len(d['notes']))
