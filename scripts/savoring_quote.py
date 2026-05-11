#!/usr/bin/env python3
"""
Arthur Brooks Savoring Quote of the Week.
Picks a quote from the quotes file using round-robin by ISO week.
"""
import urllib.request, json, os
from datetime import datetime, timezone

QUOTES_FILE = "/Users/changjieyang/.openclaw/workspace/memory/quotes/savoring-arthur-brooks.md"

QUOTE_TEMPLATE = """🌿 *Arthur Brooks — Savoring Weekly*

_{theme}_

"{quote}"

👉 {action}"""

THEMES = {
    "🔙 Past — Richness of Reminiscence": "Edit your memories to focus on the good.",
    "🔮 Present — Conscious Enjoyment": "Be fully alive in the now.",
    "⏩ Future — Keenness of Anticipation": "Look forward to joy — the preview IS the movie.",
    "🛠 Practical Techniques": "Smile, capitalize, travel in your mind.",
    "💔 Savoring the Difficult": "Write a failure journal. Learn from the fall.",
    "🎯 Meaning & Purpose": "Ask: Why am I alive? For what would I die?",
    "⚡ Core Principle": "Rebel against your negativity bias — with intention.",
}

def get_quote_for_week():
    with open(QUOTES_FILE) as f:
        content = f.read()

    week = datetime.now(timezone.utc).isocalendar()[1]

    # Split into quoted sections
    sections = {}
    current_section = None
    for line in content.split("\n"):
        if line.startswith("### "):
            current_section = line.replace("### ", "").strip()
            sections[current_section] = []
        elif line.startswith(">") and current_section:
            sections[current_section].append(line[1:].strip().strip('"'))

    section_keys = list(sections.keys())
    quote_count = sum(len(v) for v in sections.values())

    # Rotate by section + week within section
    section_idx = week % len(section_keys)
    section_key = section_keys[section_idx]
    quotes = sections[section_key]
    quote_idx = (week // len(section_keys)) % len(quotes)

    theme_header = section_key
    for emoji_theme, action in THEMES.items():
        if emoji_theme.split(" ")[1] in section_key.split(" ")[0]:  # match by word
            theme_desc = action
            break
    else:
        theme_desc = THEMES.get(theme_header, "")

    quote = quotes[quote_idx].strip()

    return QUOTE_TEMPLATE.format(theme=theme_header, quote=quote, action=theme_desc), quote_count

def send_telegram(msg):
    gateway_token = os.environ.get("OPENCLAW_GATEWAY_TOKEN", "")
    gateway_url = os.environ.get("OPENCLAW_GATEWAY_URL", "http://127.0.0.1:3000")
    chat_id = os.environ.get("ALERT_CHAT_ID", "5157095960")
    try:
        url = f"{gateway_url}/webhooks/telegram/send"
        data = json.dumps({"chatId": chat_id, "text": msg, "parse_mode": "Markdown"}).encode()
        req = urllib.request.Request(url, data=data, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {gateway_token}"
        }, method="POST")
        with urllib.request.urlopen(req, timeout=5):
            pass
        return True
    except Exception as e:
        print(f"[WARN] TG send failed: {e}", flush=True)
        return False

def main():
    quote_msg, total = get_quote_for_week()
    week = datetime.now(timezone.utc).isocalendar()[1]
    header = f"🌿 *Arthur Brooks — Savoring Weekly* | Week {week} ({total} quotes)"
    msg = msg = quote_msg.replace("🌿 *Arthur Brooks — Savoring Weekly*", header)
    print(msg, flush=True)
    send_telegram(msg)

if __name__ == "__main__":
    main()
