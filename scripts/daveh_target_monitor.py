#!/usr/bin/env python3
"""
DaveH contrarian melt-up target monitor.

Alerts only when the set of tickers within 5% of their melt-up target
MATERIALLY CHANGES vs. the last alert (dedup via state file). This stops
the every-4-hours / weekend stale-price spam.

Delivery is handled by the OpenClaw cron layer (the calling agent relays the
ALERT block). This script does NOT send Telegram itself.
"""

import urllib.request
import json
import os
from datetime import datetime, timezone

STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "daveh_state.json")

# Targets: (ticker, description, target_price)
TARGETS = [
    ("^GSPC", "S&P 500", 9500),
    ("^IXIC", "Nasdaq Composite", 32000),
    ("QQQ", "QQQ", 850),
    ("^DJI", "DJIA", 65000),
    ("^RUT", "Russell 2000", 3800),
    ("SMH", "SMH (Semiconductor ETF)", 600),
    ("GC=F", "Gold", 6800),
    ("SI=F", "Silver", 180),
    ("GDX", "GDX (Gold Miners ETF)", 180),
    ("GDXJ", "GDXJ (Junior Gold Miners ETF)", 250),
    ("SIL", "SIL (Silver Miners ETF)", 220),
    ("SILJ", "SILJ (Silver Miners Junior ETF)", 90),
]


def get_price_yahoo(ticker: str):
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=1d"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        result = data["chart"]["result"]
        if not result:
            return None
        meta = result[0]["meta"]
        return meta.get("regularMarketPrice") or meta.get("previousClose")
    except Exception as e:
        print(f"[WARN] {ticker}: {e}", flush=True)
        return None


def format_price(p: float) -> str:
    if p >= 1000:
        return f"${p:,.0f}"
    elif p >= 100:
        return f"${p:,.1f}"
    else:
        return f"${p:,.2f}"


def load_state():
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {}


def save_state(state):
    try:
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)
    except Exception as e:
        print(f"[WARN] could not save state: {e}", flush=True)


def main():
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    print(f"\n=== DaveH Target Monitor | {now} ===\n", flush=True)

    in_band = []   # within 5% of target (95-105%)
    for ticker, name, target in TARGETS:
        price = get_price_yahoo(ticker)
        if price is None:
            print(f"  {ticker:<8} {name:<40} [NO DATA]", flush=True)
            continue
        pct = (price / target) * 100
        gap = abs(pct - 100)
        within_5 = gap <= 5
        status = "WITHIN 5%" if within_5 else f"{gap:.1f}% to target"
        print(f"  {ticker:<8} {name:<40} {format_price(price):<12} vs {format_price(target)} ({pct:.1f}%) [{status}]", flush=True)
        if within_5:
            in_band.append((ticker, name, price, target, pct))

    current_set = sorted(t[0] for t in in_band)

    state = load_state()
    last_set = sorted(state.get("in_band_tickers", []))

    # Dedup: only alert when the in-band SET changes (new entrant or a ticker
    # leaving the band). Oscillation within the band does not re-fire.
    if current_set == last_set:
        print(f"\nNO_CHANGE — in-band set unchanged since last alert: {current_set or '(none)'}", flush=True)
        return

    # Material change → build alert
    entered = [t for t in current_set if t not in last_set]
    left = [t for t in last_set if t not in current_set]

    lines = ["🚨 *DaveH Melt-Up Target Alert — status changed*"]
    if in_band:
        lines.append("\nWithin 5% of target now:")
        for ticker, name, price, target, pct in sorted(in_band, key=lambda x: abs(x[4] - 100)):
            tag = " 🆕" if ticker in entered else ""
            lines.append(f"• {name}: {format_price(price)} — {pct:.1f}% of {format_price(target)}{tag}")
    if left:
        lines.append("\nNo longer within 5% (moved away / past target):")
        for tk in left:
            nm = next((n for (tt, n, _) in TARGETS if tt == tk), tk)
            lines.append(f"• {nm}")
    if not in_band and left:
        lines.append("\n(All targets now outside the 5% band.)")
    lines.append(f"\n_Checked: {now}_")
    msg = "\n".join(lines)

    print(f"\n{msg}", flush=True)

    state["in_band_tickers"] = current_set
    state["last_alert_utc"] = now
    save_state(state)


if __name__ == "__main__":
    main()
