# AI Skills Setup Status

**Date:** Feb 28, 2026
**Purpose:** Track which AI skills are available, installed, and need setup

---

## ✅ Already Available

### Ollama (Local AI)
- **Status:** Installed & Running ✅
- **Models Available:**
  - qwen2.5:7b (4.7 GB)
  - qwen2.5:14b (9.0 GB)
  - deepseek-coder-v2:latest (8.9 GB)
  - glm4:latest (5.5 GB)
- **Use:** Free local AI for simple tasks
- **Command:** `ollama run qwen2.5:7b`

### Summarize Tool
- **Status:** Installed ✅
- **Use:** Transcribe YouTube, podcasts, videos

### MCP (mcporter)
- **Status:** Installed ✅
- **Use:** Can add MCP servers for Exa AI, etc.

---

## 📋 Need Setup/Enable

### Exa AI (Free Web Search)
- **Status:** Not configured
- **Use:** Free web search for agents (saves $200/mo)
- **Setup:** Need Exa API key + MCP server

### QMD (Local Document Search)
- **Status:** Not installed
- **Use:** Local search to avoid loading full docs into context
- **Setup:** Need to install

### Obsidian
- **Status:** Skill available, not enabled
- **Use:** Second brain / knowledge management
- **Setup:** Need to enable in config

---

## 🎯 Action Items

| Item | Priority | Status |
|------|----------|--------|
| Test Ollama | High | ✅ Working |
| Enable Obsidian skill | Medium | Not done |
| Set up Exa AI MCP | Medium | Not done |
| Install QMD | Low | Not done |

---

## Safe Commands Tested

```bash
# Check Ollama
curl -s http://localhost:11434/api/tags

# List models
ollama list

# Check MCP
mcporter --version
mcporter list
```
