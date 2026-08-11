# AI Leverage Playbook

_Standing reference. Fuses the "What Claude Can Do" article with our crypto agent-loop infra work. Written 2026-08-10._

## The ladder (where the leverage lives)
Chat → Agent → Loop → Graph → Scheduled/Terminal/Browser.
Jacob is already ~3 rungs up (scheduled briefings + Claude Code). Leverage now = **teeth + caps on rungs already standing on**, not climbing higher.

## 1. Model tiering (dollar leverage)
- **Opus/Fable** — hard reasoning, buried-detail reads (theses, contracts, ETF-flow divergence). "Finds page 14."
- **Sonnet** — daily drafting/editing/coding/research.
- **Haiku / MiniMax** — summaries, formatting, routine heartbeats.
- Rule: deep model is worth it **exactly once — when the cost of being wrong > cost of thinking longer.** Don't use a neurosurgeon to check a pulse.

## 2. Feed it whole (input leverage)
- 1M-token window: stop pre-summarizing high-stakes inputs. The paragraph you cut is often the one that mattered.
- Dump full transcripts / contracts / codebases for high-stakes reads.
- Keep summarizing ONLY to save tokens on low-stakes routine.

## 3. Brief, don't drip (agent leverage)
- Tell: if you ask one thing → read → ask the next based on it, that's an **agent task disguised as a chat.** Collapse into one brief: destination + constraints + output format.
- Agent earns its place: multi-step → single usable output, ~30 min of back-and-forth saved.

## 4. Loop = agent + verify step WITH TEETH
- do → verify → redo if short → **hard stop at 3 iterations** (5 is too many).
- Verify needs teeth or it's "Claude grading its own homework":
  - (a) **binary condition** — compiles / hits count / has a source attached
  - (b) **rubric** — named criteria checked one by one
  - (c) **separate reviewer** — fresh instance, "find everything wrong," no memory of writing it. ← highest value; catches confirmation bias.
- Build a loop only for repeated, quality-over-speed work with a describable "done."

## 5. Graph = nodes + edges (real dependencies only)
- **Diamond**: fan out to parallel nodes → one synthesis node. Time = slowest node, not the sum.
- **Fake-edge test**: at each arrow ask "does data actually cross here?" If no → delete the edge, run in parallel. Expect 2–3 fake edges in any workflow = free speed.

## Cross-map to trading infra (already reasoned)
- Cross-source price sanity check = binary verify-with-teeth.
- Pre-committed OCO/limit orders = judgment encoded and resting; machine-speed at the extremes.
- Hard visit caps + kill switch = the loop's stop condition, applied to money.
- Ingest loops (price/ETF/funding/F&G) = parallel nodes; router = the synthesis convergence. That's a diamond.

## The one honest gap for this setup
web_search is disabled → live-data blind spot (hit it twice: VIX, JS-walled sources). **Claude in Chrome / browser tool** is the lever that closes it.
