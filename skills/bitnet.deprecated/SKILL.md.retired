# BitNet Integration Skill

**When to use BitNet (1-bit LLMs):**

| Task Type | Use BitNet? | Why |
|-----------|--------------|-----|
| Simple Q&A | ✅ Yes | Fast, local, cheap |
| Summaries | ✅ Yes | Quick extraction |
| Code generation (simple) | ✅ Yes | Fast responses |
| Privacy tasks | ✅ Yes | Data stays local |
| Complex reasoning | ❌ No | Use cloud API |
| Large context | ❌ No | Limited by CPU |
| Multi-step analysis | ❌ No | Use Sonnet/Opus |

---

## Commands

### Run BitNet (700M model)
```bash
cd /tmp/BitNet
source .venv/bin/activate
python run_inference.py -m models/bitnet_b1_58-large/bitnet_b1_58-large/ggml-model-i2_s.gguf -p "[PROMPT]" -n [TOKENS]
```

### Check if BitNet is available
```bash
ls /tmp/BitNet/models/bitnet_b1_58-large/bitnet_b1_58-large/ggml-model-i2_s.gguf
```

---

## Decision Framework

**Use BitNet when ALL of:**
1. Task is simple (Q&A, summary, basic extraction)
2. No complex reasoning needed
3. Privacy is important OR cost is concern
4. Speed matters (local is faster than API roundtrip)

**Use Cloud API when:**
1. Complex multi-step reasoning
2. Large model needed
3. Code analysis or debugging
4. Long context handling

---

## Cost Comparison

| Method | Cost/1M tokens | Latency |
|--------|----------------|---------|
| BitNet (local) | $0 | ~10ms/token |
| MiniMax API | ~$0.10 | ~200ms/token |
| Claude API | ~$3.00 | ~400ms/token |

**Savings:** 99%+ for simple tasks
