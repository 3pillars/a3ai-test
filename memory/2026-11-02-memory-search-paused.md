# memory_search paused — root cause: OpenAI credits exhausted (2026-11-02)

## Symptom
`memory_search` (memory-core tool) returns:
```
disabled: true, unavailable: true
index was built for model fts-only, expected text-embedding-3-small
```

## Root cause (verified via `openclaw memory status --index --agent main`)
```
Embeddings error: openai embeddings failed (model: text-embedding-3-small, batch size: 1) (429):
You have no credits remaining. Add credits to continue using the API at
https://platform.openai.com/settings/organization/billing/
[code=credit_balance_exhausted]
```
The `fts-only` vs `text-embedding-3-small` identity mismatch is a **downstream symptom** of the
failed rebuild attempt, NOT a config bug. Re-running `openclaw memory status --index --agent main`
will keep failing until OpenAI credits are restored.

Other status lines (all nominal): Vector store `ready`, FTS `ready`, Semantic vectors `ready`
(stale), memory corpus 167/191 files, 907 chunks; sessions 4745/4758 files, 8378 chunks.

## Fix — user action
Add OpenAI API credits: https://platform.openai.com/settings/organization/billing/
Then rebuild: `openclaw memory status --index --agent main`

## Workaround until fixed
Grep `~/.openclaw/workspace/memory/*.md` directly (fast, works fine). Also
`~/.openclaw/workspace/memory/heartbeat-scratch-latest.md` carries live tripwire state.

## Related
`GEMINI_API_KEY` consumer project `567549712000` is separately SUSPENDED (403 CONSUMER_SUSPENDED),
breaking the `google` plugin (web-search, speech, image/video/music gen, embedding, gemini-cli).
Two independent provider-billing problems — see the Gemini note in the memory corpus.
