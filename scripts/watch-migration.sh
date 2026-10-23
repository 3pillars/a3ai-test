#!/usr/bin/env bash
# watch-migration.sh — live terminal graph of an OpenClaw DB migration.
# The migration emits no progress; this samples DB + WAL file size over time
# so you see movement (and ETA) instead of a frozen "waiting for Gateway listener".
#
# Usage:  ./watch-migration.sh [interval_seconds]
# Ctrl-C to stop. Read-only: only stat()s files, never touches the DB.

set -euo pipefail
DB="${OPENCLAW_DB:-$HOME/.openclaw/agents/main/agent/openclaw-agent.sqlite}"
INT="${1:-10}"
sparkline="▁▂▃▄▅▆▇█"

bytes() { stat -f%z "$1" 2>/dev/null || echo 0; }
human() { awk -v b="$1" 'BEGIN{s="B K M G";split(s,u," ");i=1;while(b>=1024&&i<4){b/=1024;i++}printf "%.1f%s",b,u[i]}'; }

start=$(date +%s); prev=0; hist=""
printf "watching %s (every %ss) — Ctrl-C to stop\n\n" "$DB" "$INT"
while true; do
  db=$(bytes "$DB"); wal=$(bytes "$DB-wal"); shm=$(bytes "$DB-shm")
  now=$(date +%s); el=$((now-start))
  d=$((db-prev)); prev=$db
  # rate bucket 0-7 for sparkline (|delta| scaled by ~2MB)
  ad=${d#-}; idx=$(( ad/262144 )); [ $idx -gt 7 ] && idx=7
  ch=$(printf '%s' "$sparkline" | cut -c$((idx+1)))
  hist="${hist}${ch}"; hist="${hist: -40}"
  listener=$(lsof -nP -iTCP:18789 -sTCP:LISTEN 2>/dev/null | grep -c node || true)
  st="migrating"; [ "${listener:-0}" -ge 1 ] && st="✅ LISTENER UP (migration done)"
  printf "\r\033[K[%4ds] db=%s wal=%s Δ=%s/%ss  %s  %s" \
    "$el" "$(human $db)" "$(human $wal)" "$(human $ad)" "$INT" "$hist" "$st"
  [ "${listener:-0}" -ge 1 ] && { echo; echo "Gateway listener is up on :18789 — migration complete."; break; }
  sleep "$INT"
done
