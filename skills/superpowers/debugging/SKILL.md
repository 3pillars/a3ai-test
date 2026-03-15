---
name: superpowers-debugging
description: "Systematic debugging: Isolate, reproduce, hypothesize, test, fix. Never assume - verify."
metadata:
  {
    "openclaw":
      {
        "emoji": "🔧",
        "requires": {},
      },
  }
---

# Systematic Debugging

## Process

1. **Isolate** — Find the minimal reproduction
2. **Reproduce** — Confirm the bug exists
3. **Hypothesize** — Form a theory of the cause
4. **Test** — Verify your hypothesis
5. **Fix** — Implement the solution

## Rules

🚫 Don't assume - verify
🚫 Don't fix what you can't reproduce
🚫 Don't change code without understanding why

## Questions to Ask

- What's the expected behavior?
- What's the actual behavior?
- What's the smallest input that triggers this?
- What changed recently?
- Can I reproduce it consistently?

## Tools

- Logs (start here)
- Debugger
- Binary search (comment out half, see if bug persists)
- Rubber duck (explain to someone/something)

---

**Remember:** The bug is always in your assumptions.
