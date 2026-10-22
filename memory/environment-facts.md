# Environment Facts — verified 2026-10-22

Durable operational facts about this OpenClaw install. Update when verified changes.

## 🔴 `web_search` IS DEAD
Google/Gemini API key suspended → 403 PERMISSION_DENIED. Any automation or prompt that calls `web_search` will fail.

**Working fallbacks (all verified):**
- Google News RSS: `curl -s "https://news.google.com/rss/search?q=<query>+when:2d&hl=en-US&gl=US&ceid=US:en"` → parse `<item><title>` / `<pubDate>`
- Reader proxy: `curl -s "https://r.jina.ai/https://<url>"`
- DuckDuckGo via jina: `curl -s "https://r.jina.ai/https://duckduckgo.com/html/?q=<query>"`
- `web_fetch` on a specific URL — works fine
- `browser` tool — last resort

**Market data that works:** FRED CSV, Yahoo chart API (`query1.finance.yahoo.com/v8/finance/chart/<SYM>`), CoinGecko `api.coingecko.com/api/v3/simple/price`, DefiLlama API.

**Do NOT** put `web_search` in an automation prompt without a fallback chain — it silently kills the job.

## 🔴 `claude-cli/*` model alias is REJECTED
`agents.defaults.modelPolicy.allow` = `[anthropic/claude-opus-4-6, anthropic/claude-opus-4-8, minimax-portal/MiniMax-M2.7, minimax-portal/MiniMax-M2.7-highspeed, minimax-portal/MiniMax-M3, minimax/MiniMax-M2.7]`
Any cron job with `payload.model = claude-cli/claude-opus-4-8` fails EVERY run at preflight with:
`automation model override 'claude-cli/claude-opus-4-8' rejected by agents.defaults.modelPolicy.allow`

**Fix:** `openclaw cron edit <id> --model anthropic/claude-opus-4-8`
**Check:** `openclaw cron list` → look for `error (Nx)` status. Always audit this after any model-policy change.

## ✅ CLI cheat sheet
- `openclaw cron list` / `list --all` / `list --json` — note: `list` has NO `--id`
- `openclaw cron get <id>` — positional id (NOT `--id`, that errors)
- `openclaw cron edit <id> --model <m> --message <text>`
- `openclaw cron run <id>` — enqueues a manual run (async; poll `cron runs` after)
- `openclaw cron runs <id>` — run history w/ status + error
- `openclaw cron scratch <id>` — read; `--file <path>` to REPLACE (works, revision counter increments)
- `openclaw cron disable/enable/rm`

## ✅ Heartbeat scratch IS writable
`openclaw cron scratch a1ba3761-31f1-4584-b943-76417a7f7700 --file /tmp/hb.md`
The scratch drives the heartbeat checklist, so **a stale scratch = missed alerts**. Refresh it each session with live state. It was stale Aug/Sep 2026 through Oct 22 2026, which is why the Oct 14 CoreWeave event went unreported for 8 days.

## ⚠️ Don't manual-run state-mutating scripts twice
`coinbase-premium/scripts/analyze_and_alert.py` appends to `state/premium-log.json` and detects regime flips against the PRIOR row. Two manual runs in a row fabricate a false "REGIME FLIP" alert. If you must test: back up `state/premium-log.json` first and restore it after.

## ⚠️ `sqlite3` CLI cannot open OpenClaw state DBs
Error: "external sqlite3 cannot open databases under the active OpenClaw state directory." Use `openclaw` commands, or copy a DB outside `OPENCLAW_STATE_DIR` first.

## Skills
- `~/.openclaw/skills/coinbase-premium/` — scripts/fetch_prices.py, analyze_and_alert.py, state_manager.py; state/premium-log.json
- `~/.openclaw/skills/private-credit-consumer/` — scripts/fetch_consumer_credit.py --report
