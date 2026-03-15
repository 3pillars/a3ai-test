---
name: superpowers-tdd
description: "Test-Driven Development: RED → GREEN → REFACTOR. Write failing test first, watch it fail, write minimal code to pass, then refactor."
metadata:
  {
    "openclaw":
      {
        "emoji": "🧪",
        "requires": {},
      },
  }
---

# Test-Driven Development (TDD)

Follow the red-green-refactor cycle strictly.

## The Cycle

1. **RED** — Write a failing test
2. **GREEN** — Write minimal code to pass
3. **REFACTOR** — Improve code while keeping tests green

## Rules

🚫 **NEVER write code before a failing test**
🚫 **NEVER write more code than needed to pass**
🚫 **NEVER skip refactoring**

## Process

1. Write smallest possible test
2. Run test → it MUST fail
3. Write minimal code to make test pass
4. Run test → it MUST pass
5. Refactor code (optional)
6. Commit
7. Repeat

## When Stuck?

- If test is too complex → simplify it
- If code is too complex → write simpler version first

---

**TDD Mantra:** "Make it work, make it right, make it fast"
