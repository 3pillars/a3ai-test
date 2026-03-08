# Security Audit — 2026-03-08 09:00 AM PST

## Firewall
- Status: **Unknown** (requires sudo — could not read ALF plist without elevated permissions)
- Action needed: Verify firewall is ON via System Settings → Network → Firewall

## Intrusion Detection
- fail2ban: **Not installed** (not running)
- No macOS-native brute-force blocking equivalent detected

## Open Ports — Public-Facing (⚠️ review these)
| Port | Process | Notes |
|------|---------|-------|
| 9108 | `dcrd` | Decred crypto daemon — P2P port, expected |
| 3283 | `ARDAgent` | Apple Remote Desktop — accessible remotely |
| 3000 | `node` | Unknown Node.js app — public-facing! |
| 5000 | `ControlCenter` | AirPlay Receiver |
| 7000 | `ControlCenter` | AirPlay Receiver |

## Open Ports — Localhost Only (safe)
- 3334, 18789, 18791, 18792, 9109, 1234, 41343, 54257, 56510 — internal only
- 11434: **Ollama** (localhost only — good)
- 8021: unknown (localhost)

## Docker
- **Not available** on this machine

## Notable Findings
1. ⚠️ **Port 3000 (Node.js)** — public-facing, process unclear. May be a dev server accidentally exposed.
2. ⚠️ **ARD (port 3283)** — Apple Remote Desktop agent running. If not in active use, consider disabling.
3. ⚠️ **AirPlay Receiver (5000/7000)** — publicly accessible. Can be restricted in System Settings → AirDrop & Handoff.
4. ℹ️ **dcrd** — Decred node on port 9108, expected for crypto operations.
5. ✅ **Ollama** — localhost only, not exposed externally.
6. ✅ **No fail2ban needed** — macOS handles auth via PAM; SSH brute force limited by macOS defaults.
