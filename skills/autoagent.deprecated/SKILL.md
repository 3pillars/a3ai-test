# SKILL.md — AutoAgent (Autonomous Harness Engineering)

## When to Use This Skill

Use when Jacob wants to:
- Run autonomous agent self-improvement experiments
- Optimize an agent harness on a benchmark
- Clone and run the AutoAgent repo
- Understand the meta/task agent architecture

## What AutoAgent Is

An open-source library (`github.com/kevinrgu/autoagent`) for **autonomous harness engineering** — a meta-agent that improves a task agent's harness by editing it, running benchmarks, reading failure traces, and iterating.

**Key result:** Hit #1 on SpreadsheetBench (96.5%) and TerminalBench (55.1%) after 24+ hours of autonomous iteration — all discovered, no hand-tuned baselines.

## Core Architecture

```
meta-agent (edits agent.py)  →  task agent (solves tasks)
         ↑                           |
         └──── failure traces ←────────┘
              (score hill-climb)
```

### Two key files in the repo:

**`agent.py`** — single-file harness, split into two zones:
- **EDITABLE** (above fixed boundary): SYSTEM_PROMPT, MODEL, MAX_TURNS, create_tools(), create_agent(), run_task()
- **FIXED**: Harbor adapter + ATIF trajectory serialization (do not touch unless Jacob explicitly says)

**`program.md`** — the meta-agent's directive. Defines:
- What kind of agent to build
- Experiment loop (edit → run → measure → analyze → keep/discard)
- Tool strategy (specialized tools > generic shell)
- Anti-overfitting rule (forced self-reflection)
- NEVER STOP directive

## How to Run

```bash
# 1. Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Clone
git clone https://github.com/kevinrgu/autoagent.git
cd autoagent

# 3. Set API key
cat > .env << 'EOF'
OPENAI_API_KEY=...
EOF

# 4. Build base image
docker build -f Dockerfile.base -t autoagent-base .

# 5. Run a single task
rm -rf jobs; mkdir -p jobs && uv run harbor run -p tasks/ \
  --task-name "<task-name>" -l 1 -n 1 \
  --agent-import-path agent:AutoAgent -o jobs --job-name latest > run.log 2>&1

# 6. Run full benchmark
rm -rf jobs; mkdir -p jobs && uv run harbor run -p tasks/ -n 100 \
  --agent-import-path agent:AutoAgent -o jobs --job-name latest > run.log 2>&1
```

## Key Design Patterns

### 1. Specialized Tools > Generic Shell
A single `run_shell` tool wastes tokens on boilerplate and introduces errors. Specialized tools:
- Surface structured data instead of raw stdout
- Provide clear error messages the model can act on
- Match the model's name-based priors (models pattern-match tool names before reading descriptions)

Example from the paper: spreadsheet tasks got tools for workbook inspection, targeted cell reading, validated cell writing.

### 2. Same-Model Pairing Wins
Claude meta-agent + Claude task agent > Claude meta-agent + GPT task agent.
- Same weights → meta-agent writes harnesses the inner model *actually understands*
- Implicit understanding of own limitations/tendencies

### 3. Agent.asTool() for Verification
Wrap a verification sub-agent as a callable tool for the main agent. The main agent can call it to re-read output and check against task requirements before finishing.

### 4. Trajectory Serialization
`to_atif()` converts the full reasoning trace to structured JSON:
- Every step with source, message, reasoning_content
- Tool calls with arguments and observations
- Final metrics (tokens, duration, turns)

This is what the meta-agent reads to understand *why* something failed.

### 5. Anti-Overfitting Safeguard
Before accepting any harness change, ask:
> "If this exact task disappeared, would this still be a worthwhile harness improvement?"

If no → discard. Prevents rubric-specific prompting that games metrics.

## Experiment Loop

```
1. Edit harness (above fixed boundary in agent.py)
2. Run benchmark (harbor run)
3. Measure score
4. Read failure traces from jobs/*/trajectory.json
5. Group failures by root cause
6. Keep if passed improved OR (passed same + harness simpler)
7. Discard otherwise
8. Repeat — NEVER STOP unless Jacob interrupts
```

## Results Log

Every experiment logged to `results.tsv`:
```
commit | avg_score | passed | task_scores | cost_usd | status | description
```

Status: `keep` / `discard` / `crash`

## Integrating with OpenClaw

For Jacob's use case — use `sessions_spawn` with `runtime: "acp"` to spin up a coding agent that reads `program.md` and runs the experiment loop autonomously:

```
Point a coding agent at the repo → prompt: "Read program.md and kick off an experiment"
```

The coding agent becomes the meta-agent. It will:
- Read program.md directive
- Edit agent.py harness
- Run benchmarks via Docker
- Read trajectories
- Iterate autonomously

## Anti-Patterns to Avoid

- **Don't use a poorly designed meta-agent** — Codex ignores "never stop" directives, gives up too early
- **Don't skip trajectories** — without failure traces, improvement rate drops hard. Understanding *why* matters as much as *that* it improved
- **Don't one-agent self-improvement** — being good at a domain and being good at improving at that domain are different capabilities. Use meta/task split
- **Don't add task-specific hacks** — they fail the anti-overfitting test

## Key Files to Reference

| File | Purpose |
|------|---------|
| `agent.py` | Task agent harness (editable section) |
| `program.md` | Meta-agent directive + experiment loop |
| `Dockerfile.base` | Base container image |
| `docs/good-harness.md` | Tool design patterns |
| `docs/openai-agents-sdk/tools.md` | agent.as_tool(), handoff mechanics |
| `tasks/` | Benchmark tasks (Harbor format) |
| `jobs/*/trajectory.json` | Per-run reasoning traces |
| `results.tsv` | Experiment ledger |

## Cleanup

```bash
# Harbor cached images + cache
uv run harbor cache clean -f

# Full Docker nuke
docker system prune -a -f

# Light: dead containers only
docker container prune -f

# If Docker becomes unresponsive (after many concurrent runs)
killall Docker && open -a Docker
```
