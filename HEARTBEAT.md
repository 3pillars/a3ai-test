# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## Session Auto-Save (Every ~30 min)

Every heartbeat cycle:
1. Check if today's `memory/YYYY-MM-DD.md` exists
2. If missing, create it
3. Append a session summary:
   - Topics discussed
   - Key decisions/actions
   - Any user preferences mentioned
   - Files created/modified
