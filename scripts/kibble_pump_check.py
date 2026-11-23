#!/usr/bin/env python3
"""Kibble board-pump monitor (headless check for the scheduled automation).

Reports ONLY on a real change:
  - /api/board engine_seq advanced past the frozen value, or
  - the clean DID's kibble-score-v2 score became non-zero / found=true, or
  - the answer-bank watcher died (then it is relaunched), or
  - our own ATTEST finally shows up in a board row's `attestations` (ingest
    caught up), or
  - a new job appears in the needs_attest view that is not yet in our
    attest ledger (attestable peer work became available), or
  - a fetch failed (so the failure is visible rather than silent).

State (last seen engine_seq / score / known needs_attest ids) lives in
/tmp/kibble_pump_state.json.
Exit 0 with empty stdout = no change = intentional silence.
"""
import json
import os
import subprocess
import urllib.request

BOARD = "https://kibble.world/api/board"
NEEDS_ATTEST = "https://kibble.world/api/board?needs_attest=1"
SCORE = ("https://kibble.world/api/score?did="
         "did:key:z6MkgAKzqnh7L6NgQJ7QFfE7j5hRhzViEdsJ3br5kpNwjRy9")
STATE = "/tmp/kibble_pump_state.json"
LEDGER = "/tmp/kibble_attest_ledger.json"
LAUNCH = "/tmp/launch_watch.py"
AGENT_DIR = "/Users/changjieyang/flop_agent"
CLEAN_DID = "did:key:z6MkgAKzqnh7L6NgQJ7QFfE7j5hRhzViEdsJ3br5kpNwjRy9"


def fetch(url, timeout=12):
    req = urllib.request.Request(url, headers={"User-Agent": "flop-a3ai/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, obj):
    try:
        with open(path, "w") as f:
            json.dump(obj, f)
    except Exception:
        pass


def watcher_alive():
    try:
        out = subprocess.run(["pgrep", "-f", "kibble_watch2.py"],
                             capture_output=True, text=True, timeout=10).stdout
        return [p for p in out.split() if p.strip()]
    except Exception:
        return []


def main():
    state = {}
    try:
        with open(STATE) as f:
            state = json.load(f)
    except Exception:
        state = {}

    problems = []
    board = score = needs = None
    try:
        board = fetch(BOARD)
    except Exception as e:
        problems.append("board fetch failed: %s: %s" % (type(e).__name__, e))
    try:
        score = fetch(SCORE)
    except Exception as e:
        problems.append("score fetch failed: %s: %s" % (type(e).__name__, e))
    try:
        needs = fetch(NEEDS_ATTEST)
    except Exception as e:
        problems.append("needs_attest fetch failed: %s: %s" % (type(e).__name__, e))

    engine_seq = (board or {}).get("engine_seq")
    hw = (board or {}).get("stats_high_water")
    sc = (score or {}).get("score")
    found = (score or {}).get("found")
    terms = ((score or {}).get("breakdown") or {}).get("terms")

    last_seq = state.get("engine_seq")
    last_score = state.get("score")

    # Attest ledger: which jobs we already attested (by job_id -> result_hash).
    ledger = load_json(LEDGER, {})

    # Which needs_attest jobs are open right now, and which are NOT ours.
    needs_rows = (needs or {}).get("jobs") or []
    open_peer = {}
    for j in needs_rows:
        if not j.get("result_hash"):
            continue
        if j.get("worker_did") == CLEAN_DID:
            continue  # our own work: never attest it
        open_peer[j["job_id"]] = j.get("result_hash")
    new_peer = {k: v for k, v in open_peer.items() if k not in ledger}

    # Did our own attest finally get ingested by the board?
    attested_inboard = any(
        CLEAN_DID in json.dumps(a)
        for j in ((board or {}).get("jobs") or [])
        for a in (j.get("attestations") or []))
    was_inboard = bool(state.get("attest_inboard"))

    # Persist state regardless, so the next run compares against this.
    new_state = {"engine_seq": engine_seq, "score": sc, "found": found,
                 "hw": hw, "ts": state.get("ts"),
                 "attest_inboard": attested_inboard,
                 "known_needs_attest": sorted(set(open_peer) | set(ledger))}
    save_json(STATE, new_state)

    # Watcher self-heal: a dead watcher means no more jobs get answered.
    pids = watcher_alive()
    relaunched = False
    if not pids:
        try:
            subprocess.run(["python3", LAUNCH], capture_output=True, timeout=20,
                           cwd=AGENT_DIR)
            relaunched = True
        except Exception as e:
            problems.append("watcher relaunch failed: %s: %s" % (type(e).__name__, e))

    changed = []
    if last_seq is not None and engine_seq is not None and engine_seq != last_seq:
        changed.append("board pump RESUMED: engine_seq %s -> %s (hw %s)"
                       % (last_seq, engine_seq, hw))
    if last_score is not None and sc is not None and sc != last_score:
        changed.append("score changed: %s -> %s (found=%s)" % (last_score, sc, found))
    if sc not in (None, 0) and (last_score in (None, 0)):
        changed.append("score is now %s (found=%s) terms=%s" % (sc, found, terms))
    if relaunched:
        changed.append("answer-bank watcher was DEAD -> relaunched")
    if attested_inboard and not was_inboard:
        changed.append("our ATTEST is now INGESTED by the board (attestations array filled)")
    if new_peer:
        for jid, rh in sorted(new_peer.items()):
            changed.append("new attestable peer job: %s rh:%s" % (jid, rh))

    if not changed and not problems:
        return 0

    out = ["Kibble pump monitor:"]
    out += ["- " + c for c in changed]
    out += ["- " + p for p in problems]
    out.append("- board engine_seq=%s stats_high_water=%s | score=%s found=%s terms=%s"
               % (engine_seq, hw, sc, found, terms))
    out.append("- needs_attest peer jobs: %s | our attest ingested: %s"
               % (sorted(open_peer) or "none", attested_inboard))
    print("\n".join(out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
