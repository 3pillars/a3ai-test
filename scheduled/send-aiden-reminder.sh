#!/bin/bash
# One-shot: emails Jacob a reminder + sample time-capsule letter for Aiden.
# Loaded as launchd agent com.jacob.aiden-letter; self-removes after it fires.
export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export GOG_ACCOUNT="ssjbinance1@gmail.com"

BODY="/Users/changjieyang/.openclaw/workspace/scheduled/aiden-letter-email.txt"
LOG="/Users/changjieyang/.openclaw/workspace/scheduled/aiden-letter.log"

echo "[$(date)] firing" >> "$LOG"

gog gmail send \
  --to changjieyang@gmail.com \
  --subject "Reminder: write Aiden's time-capsule letter (due 8/26-8/27) + sample" \
  --body-file "$BODY" >> "$LOG" 2>&1

echo "[$(date)] gog exit=$?" >> "$LOG"

# Self-remove so it never fires again (one-shot).
PLIST="$HOME/Library/LaunchAgents/com.jacob.aiden-letter.plist"
/bin/launchctl bootout "gui/$(id -u)/com.jacob.aiden-letter" 2>/dev/null
rm -f "$PLIST"
echo "[$(date)] launchd agent removed" >> "$LOG"
