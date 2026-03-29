# karpathy-learn — Structured Deep Learning Distiller

## When to Use

Trigger this skill when Jacob wants to **truly understand** something complex:
- "Learn this video: [URL]"
- "Karpathy this: [article/paper/podcast]"
- Any time a deep dive into a complex topic is requested

**Not for** quick lookups or simple factual questions — only for substantive content that deserves rigorous analysis.

## What It Produces

A ~200-line structured markdown file in `memory/learnings/` covering:
1. **Core Thesis** — What is this really about?
2. **Key Mechanisms** — How does it work?
3. **PRO Arguments** — Strongest evidence and reasoning supporting the thesis
4. **CON Arguments** — Strongest objections, limitations, counterpoints
5. **Verdicts** — Where genuine uncertainty remains; what would change your mind
6. **Open Questions** — What the source didn't answer; gaps to explore

This is **not a summary**. A summary tells you what. This tells you what it means, how it could be wrong, and what remains uncertain.

## Workflow

### Step 1: Transcribe/Extract Content
Use the `summarize` skill or direct fetch to get the raw content:
```
User: Learn this video: http://youtube.com/watch?v=...
↓
Agent: Fetch + transcribe video/audio content
```

### Step 2: Generate Karpathy-Style Analysis
Run the extracted content through iterative PRO/CON/VERDICT analysis. Use the following prompt structure:

```
You are a rigorous analytical thinker in the style of Andrej Karpathy.
Analyze the following content and produce a structured distillation:

SOURCE: [title/URL]
TYPE: [video|paper|podcast|article]

Produce the following sections:

=== CORE THESIS (2-3 sentences) ===
What is this really about? State the central claim precisely.

=== KEY MECHANISMS (bullets) ===
How does it work? What are the specific mechanisms, processes, or arguments?

=== PRO ARGUMENTS ===
3-5 of the strongest arguments supporting this thesis. Be specific — cite
mechanisms, evidence, or logical structure. No straw men.

=== CON ARGUMENTS ===
3-5 of the strongest objections. Steelman the best critics. Be fair — present
the strongest version of the counterargument, not the weakest.

=== VERDICTS ===
Where does genuine uncertainty remain? What would actually change your mind?
What predictions follow, and what would falsify them?

=== OPEN QUESTIONS ===
What did this source NOT answer? What gaps remain? What deserves deeper
investigation?

=== MY TAKE ===
[Your own honest assessment as an experienced generalist. What resonates?
What seems off? What questions do you still have?]

Format: ~200 lines total. Tight writing. No padding. Use headers, bullets,
and selective quotes from the source. No emojis in the document itself
(they go in the report). Every sentence should carry weight.

CONTENT:
[full transcribed/extracted content]
```

### Step 3: Write to File
```
Save as: memory/learnings/[slug]-[YYYY-MM-DD].md
```

Slug format: first 3-4 words of topic, lowercase, hyphenated.
Example: `karpathy-agents-2026-03-28.md`

Include a brief **report header** at the top of the file:
```
# [Title]

**Source:** [URL]
**Date:** [YYYY-MM-DD]
**Type:** [video|paper|podcast|article]
**Time:** [runtime or length if known]
**Status:** ✅ analyzed

## 1-Sentence Summary
[One sentence that captures the core insight]

## Key Takeaways
- [Bullet 1]
- [Bullet 2]
- [Bullet 3]
```

### Step 4: Report to User
Send a brief Telegram message:
```
📚 Learned: [Title]

[1-sentence summary]

Key insight: [most interesting thing learned]
Key uncertainty: [what remains genuinely unclear]

Saved to: memory/learnings/[slug].md
```

## File Storage

- **Location:** `memory/learnings/`
- **Naming:** `[topic-slug]-[YYYY-MM-DD].md`
- **Index:** Optionally maintain `memory/learnings/INDEX.md` listing all past distillations

## Quality Standards

- PRO/CON must present the **strongest** arguments, not weakest
- Verdicts should identify **genuinely falsifiable** claims
- "My Take" must be honest — include doubts, not just agreement
- No padding, no filler phrases ("It is worth noting that...")
- Target ~200 lines but quality > length
- If source is shallow (celebrity drama, etc.), say so and skip the deep dive

## Integration Points

- **Trading research:** Use for paper reviews, macro analysis
- **AI developments:** Use for key talks, research papers, model releases
- **Geopolitics:** Use for substantive analyses, policy papers
- **Personal growth:** Use for book summaries, course materials

## When to Skip

Don't create a full distillation if:
- The content is trivial (celebrity news, pure entertainment)
- Jacob only asked for a quick fact
- The content is already well-understood
- It's a duplicate of a recent distillation

Use judgment — the goal is **quality understanding**, not volume of notes.
