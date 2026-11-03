# Pitfall: bare zsh glob in `exec` hangs the session

## Symptom
An `exec` call running `ls ~/flop_agent/*.flag` (a glob with **no matches**) hung for **8m21s**
and reported `failed`. It blocked the OpenClaw exec lane — the next `heartbeat-main` automation
tick then recorded `lastRunStatus: error`.

## Root cause
zsh (the configured shell) raises `no matches found` on an unmatched glob and **aborts the
command**, but through the exec/PTY wrapper the shell did not exit cleanly — the session sat
there until it was SIGTERM'd.

## Rule
Never use a bare unmatched zsh glob in `exec`. Use one of:

```bash
ls ~/flop_agent/*.flag 2>/dev/null; echo "flags:$?"   # explicit
find ~/flop_agent -maxdepth 1 -name '*.flag' | wc -l   # safest
```

## Detection
```bash
pgrep -fl "flop_agent" || echo "no flop_agent processes"
```

## Related
- Yahoo's chart API **requires a browser UA** (`-A "Mozilla/5.0"`); without it every request
  returns non-JSON and the downstream python parse fails with a confusing
  `JSONDecodeError: Expecting value: line 1 column 1`.
- `memory_search` is paused because OpenAI API credits are exhausted — see
  `2026-11-02-memory-search-paused.md`.
