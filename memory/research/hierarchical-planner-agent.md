# Hierarchical Planner AI Agent

Source: MarkTechPost - "A Coding Implementation to Build a Hierarchical Planner AI Agent Using Open-Source LLMs"

## Architecture

```
User Task
    ↓
[Planner Agent] → Decomposes into 3-8 steps
    ↓
[Executor Agent] → Executes each step (LLM or Python tool)
    ↓
[Aggregator Agent] → Synthesizes final response
```

## Three Components

### 1. Planner Agent
- Breaks high-level goals into actionable steps
- Outputs structured JSON with: goal, assumptions, steps
- Each step has: id, title, instruction, tool, expected_output

### 2. Executor Agent
- Executes each step using either:
  - `llm` - language reasoning
  - `python` - code execution
  - `none` - simple tasks
- Receives context from prior steps

### 3. Aggregator Agent
- Combines step outputs into final response
- Structured, correct, practical output

## Key Technical Details

### Model
- Qwen/Qwen2.5-1.5B-Instruct (open-source)
- 4-bit quantization for efficiency
- Runs on GPU or CPU

### Tool Execution
- `run_python()` - safely executes generated Python code
- `llm_chat()` - structured LLM interaction

### JSON Extraction
- Robust parsing from model outputs
- Handles fenced and inline JSON
- Fallback to default plan on failure

## Code Structure

```python
# Core functions
llm_chat(system, user, max_new_tokens, temperature)
run_python(code) -> {ok, stdout, error}
extract_json_block(text) -> dict or None

# Agent functions
planner_agent(task) -> plan (JSON)
executor_agent(step, context) -> StepResult
aggregator_agent(task, plan, results) -> final response

# Orchestration
run_hierarchical_agent(task, verbose=True)
```

## Why This Matters

1. **Modular** - Each agent has specific role
2. **Structured** - JSON plans are verifiable
3. **Tool-enabled** - Can execute Python code
4. **Open-source** - No API dependency
5. **Scalable** - Can extend to more agents

## Comparison to Mem0 Approach

| Aspect | This Article | Mem0 |
|--------|--------------|------|
| Focus | Planning/execution | Memory |
| Architecture | Multi-agent | Single agent |
| Tools | Python execution | Retrieval |
| Use case | Complex tasks | Personalization |

## For Jacob's Trading Agent

This architecture could power:
- Trading signal analysis (planner decomposes → executors run calculations → aggregator summarizes)
- Multi-market monitoring (parallel executors)
- Risk assessment (planner → python executor → results)
