# Memory as a Knowledge Graph — One-Pager

Source: Anthropic Claude Cookbook, "Knowledge Graph Guide"
(https://platform.claude.com/cookbook/capabilities-knowledge-graph-guide)
Distilled 2026-08-16 for Jacob's OpenClaw memory system. Purpose: turn the flat
MEMORY.md monolith into a graph the agent can *traverse*, not just grep.

## The one idea that matters
RAG/grep finds text that *looks similar*. A graph follows a *real chain of facts*.
"Which sentinel watches the AI-capex thesis?" should traverse
`Myrmikan-report → AI-capex-thesis → ai-capex-credit-sentinel → cron-job`,
not return three files that happen to contain the word "capex."
Our `[[links]]` are already graph edges. We just haven't been disciplined about them.

## The 4-stage pipeline, mapped to OUR files

### 1. Extract — one fact, typed, with a description
Each `memory/*.md` = one node. Frontmatter already does this:
- `name:` = canonical ID (the node key)
- `metadata.type:` = node type (user | feedback | project | reference)
- `description:` = the **disambiguation line** — this is the load-bearing field the
  cookbook stresses. It's what lets resolution tell two same-named things apart.
Rule: description must be specific enough to disambiguate, not just restate the title.

### 2. Resolve — kill duplicates by meaning, not string match
The cookbook's core warning: same real-world entity shows up under different names
("Edwin Aldrin" / "Buzz Aldrin"). Cluster by the *description*, not the spelling.
Our live example: "Andy" appears across files — one canonical `andy-2e-profile`,
everything else links to it. Before writing a new memory, search for the entity it's
about; if a node exists, **update + link**, don't create a twin.
- False merge = collapsing two different things (bad). 
- Missed merge = two files for one thing (the quiet, common failure). Watch this one.

### 3. Assemble — edges carry direction + provenance
- Use `[[name]]` liberally; a link to a not-yet-written node is a valid TODO, not an error.
- **Provenance on every fact** (cookbook: every edge cites its source doc). Our version:
  `Source: <path#line>` or a dated URL. A memory that can cite where it came from is
  trustworthy; one that can't is a rumor. Already half-doing this — make it a rule.
- Direction matters: "sentinel *watches* thesis" ≠ "thesis *watches* sentinel."

### 4. Query — traverse before answering
Recall step = start at the relevant node, walk its `[[links]]` one or two hops, THEN
answer. That's the whole value: multi-hop answers across files instead of one flat match.

## What to actually do (migration, not a rewrite)
1. Stop growing the flat monolith. New durable facts → one node file w/ full frontmatter.
2. Backfill `description:` on existing nodes so it disambiguates (Stage 1/2).
3. Add `Source:` provenance to any fact that makes a claim (Stage 3).
4. Link liberally — every node should point at its neighbors (Stage 3).
5. On write: search first, merge-or-link, never duplicate (Stage 2 — the missed-merge guard).

## The agentic half (bonus — already gesturing at it)
The same source's agent-design idea: explicit states + a retry cap that escalates to
Jacob instead of guessing. The AI-capex sentinel already does a crude version
(fixed spec → alert-or-quiet → escalate on regime change). Formalize retry limits +
"escalate to human" in future cron/agent specs.

## Failure log (keep this honest — the compounding habit)
Dated entries of resolution/link mistakes as they happen. This log is worth more than
the graph itself over time.
- (none yet)
