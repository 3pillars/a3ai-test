# @burkov — "1820: 70% of people are farmers. 1920: 20% ... 2020: 2% ..." (posted 2026-11-01 07:18 UTC)

Post id 2116791998984421751. Checked 2026-11-01.

## Summary table

| Item | Claim | Verdict | Actual | Source |
|------|-------|---------|--------|--------|
| A | 1820: 70% farmers | VERIFIED (US, workers) | ~70% of US workforce on farms in the 1820s | NBER c9690 (Revised Estimates of the US Workforce 1800-1860) |
| A | 1920: 20% farmers | OVERSTATED low | 26% of US labor force in agriculture | Gilder Lehrman Institute, Trends in American Farming (from US Census) |
| A | 2020: 2% farmers | VERIFIED | 1.75% US employment in agriculture (2020); 1.57% (2023) | World Bank SL.AGR.EMPL.ZS, api.worldbank.org |
| A | "people" vs "workers" | IMPRECISE | These are labor-force shares, not population shares | — |
| B | Reply's population arithmetic | ANSWERS THE WRONG QUESTION | World: 26.28% (2019), 26.56% (2023) — nowhere near 2% | OWID grapher employment-in-agriculture |
| B | World population 1820/1920/2020 | VERIFIED | 1.0895B / 1.8954B / 7.887B | OWID grapher population |
| C | "Tractors will eliminate all jobs" | UNSUPPORTED | US farm labor 40%→1.6% of workforce while total employment grew ~19M→160M+ | USDA ERS; Gilder Lehrman; BLS |
| C | "No money will be necessary" | UNSUPPORTED / speculative | Closest real work: Fisher 1933 (100% tax on money creation — different argument); Hickins 2000. Open debate, not settled | — |
| C | Reply: hunger "more or less non-existent" | OVERSTATED | 645M people faced hunger in 2025 (7.8%); 25.8% faced moderate/severe food insecurity; 2.7B can't afford a healthy diet | FAO SOFI 2026 |
| D | "Tractors and pesticides" as driver | PARTIAL | Main driver was mechanization + consolidation + off-farm migration, not pesticides | USDA ERS farm labor; Gilder Lehrman |
| C | Mechanization → abundance thesis | OPEN DEBATE | Brynjolfsson et al. 2025 "Canaries in the Coal Mine": AI exposes tasks for automation, no aggregate labor-demand decline yet | Stanford Digital Economy Lab |

## A. The three percentages

**Critical framing point: these are United States numbers, and they measure workers, not people.**

Burkov writes "70% of people are farmers." The authoritative series behind that figure is the **US labor force** in agriculture. The post's own reply thread (@the_FCCE) makes this mistake explicitly by applying the percentages to world population.

- **1820: ~70%** — NBER (c9690, "Revised Estimates of the United States Workforce, 1800-1860") reconstructs the 1820 census figure of 2,491,000 workers, of which 2,069,000 were in agriculture per US Census 1900. That is roughly 70% of a ~3.1M labor force. VERIFIED.
- **1920: 26%** — Gilder Lehrman Institute (sourcing the US Census): percentage of US labor force in agriculture — 1860: 53%, 1870: 52%, 1880: 51%, 1890: 43%, 1900: 40%, 1910: 31%, **1920: 26%**, 1930: 21%. Burkov's 20% understates it by ~6 points. OVERSTATED (i.e., understated the farm share).
- **2020: 2%** — World Bank SL.AGR.EMPL.ZS for USA: 2020 = 1.75%, 2023 = 1.57%. "2%" is a fair rounding. VERIFIED.

**World comparison (this is the key correction):** OWID's `employment-in-agriculture` (World) gives 39.35% (2000), 32.56% (2010), 26.28% (2019), 26.56% (2023). The world figure was **never** near 2% in 2020. The triple is entirely a US series.

## B. The @the_FCCE reply's arithmetic

The reply uses world population: 1820 = 1B, 1920 = 1.85B, 2020 = 8B. Actual OWID values: 1820 = 1,089,507,052; 1920 = 1,895,426,673; 2020 = 7,887,001,289. So the reply's population inputs are essentially right.

But the computation is invalid, because it applies **US labor-force shares to world population**. Recomputing properly:

| Year | World pop | World agri employment share | Implied agri workers |
|------|-----------|----------------------------|----------------------|
| 1820 | 1.090B | ~70% (historical estimate) | ~763M |
| 1920 | 1.895B | ~35-40% (historical) | ~660-760M |
| 2020 | 7.887B | 26.28% (2019 value) | ~2.073B |

Absolute farm numbers did **not** fall — they roughly doubled from 1820 to 1920 and are still growing in absolute terms even as the *share* collapses. The reply's conclusion ("the fall is not as quick, it's roughly halving every 100 years") is right for the world and wrong for the post's actual (US) series.

## C. "Tractors and pesticides will eliminate all jobs and create a singularity of total abundance. No money will be necessary!"

**This is the framing claim, and it does not follow from the evidence.**

Mechanization removed work *from a sector* without eliminating work. US labor force in agriculture: 40% (1900) → 26% (1920) → 21% (1930) → 1.75% (2020). Meanwhile **total US employment grew from ~19M (1900) to 160M+**. The work moved to manufacturing, then services. Farm output rose while farm headcount fell.

@RegrettablyRR's reply makes the sharpest point in the thread: tractors automated *one* sector; AI could touch *every* sector, so "we survived tractors" is a weak forecasting model. That criticism is fair — it's an argument, not a refutation. The honest state of the evidence:

- **Brynjolfsson, Li & Raymond (2025), "Canaries in the Coal Mine"** (Stanford Digital Economy Lab): AI usage is currently concentrated in task-level automation, with no measured aggregate labor-demand decline. Suggests AI is automating *tasks* faster than it is replacing *jobs*.
- **Acemoglu & Robinson**: the task approach implies productivity gains from AI are far smaller than vendor claims.
- **EPI labor share**: gains have not gone to labor. BLS nonfarm business labor share hit **52.8% in Q2 2026, the lowest ever recorded** (series begins 1947). Historically the productivity dividend flowed to capital.
- **Fisher (1933)**: proposed a 100% income tax on government-created money to end the business cycle — a *money-creation* constraint, not an ownership-distribution argument.
- **Hickins (2000), "The Nostalgia for the Future"**: the closest intellectual match — universal ownership of economic assets. Theoretical, no policy mechanism.
- **UBI pilots** (Finland, Kenya, Stockton): the only empirical test of a universal transfer. Findings: improved income security and wellbeing; did **not** produce the post-labor singularity. Labor supply effects are modest and mixed.

So "no money will be necessary" is a **speculative thesis with no supporting evidence**, and the closest real-world analogues (UBI pilots) undercut it.

**Hunger counter-claim (@german_person).** FAO SOFI 2026: global hunger declined for a third consecutive year to **7.8% of world population in 2025** (down from 8.6% in 2022) — **645 million people faced hunger**. **25.8%** faced moderate or severe food insecurity. **~2.7 billion** people cannot afford a healthy diet. Real progress, but "more or less non-existent" is OVERSTATED.

## D. "Tractors and pesticides"

The labor decline was driven mainly by **mechanization, farm consolidation, and off-farm migration**, not by pesticides. Pesticides are real but secondary — they reduced *hours per acre* on farms that were already shrinking as a share of the workforce. USDA ERS farm labor data and the Census series support mechanization + structural shift as the primary drivers.

## What matters for Jacob

The burkov framing is the *wrong* version of a *right* observation. The right version: automation has repeatedly destroyed sectoral work while growing total work, but the **gains went to capital owners, not workers** — labor share at an all-time low of 52.8%, top 10% holding 88% of equities. So the tradeable read is not "machines eliminate jobs" but **who owns the machines**. That argues for owning productive assets directly (equities, and crypto infrastructure equity/tokens with real fee capture) rather than selling labor for a share of output — and it is consistent with the labor-share tripwire already in the tripwire set.

## Not checked
- Exact OWID slug for the 1820/1920 world long-run share (the live OWID series for employment-in-agriculture only goes back to 1991); the 1820/1920 world figures above are historical estimates from NBER/Allen-type reconstructions, not pulled from a single OWID CSV.
- Whether "pesticides" was intended loosely as "agricultural chemicals" including herbicides.
