#!/usr/bin/env python3
"""
DaveH contrarian melt-up target monitor.
Alert if any target is within 5% of target price.
"""

import urllib.request
import json
import time
from datetime import datetime, timezone

# Targets: (ticker, description, target_price)
TARGETS = [
    # Major Equity Indices
    ("^GSPC", "S&P 500", 9500),
    ("^IXIC", "Nasdaq Composite", 32000),
    ("QQQ", "QQQ", 850),
    ("^DJI", "DJIA", 65000),
    ("^RUT", "Russell 2000", 3800),
    # Semiconductors
    ("SMH", "SMH (Semiconductor ETF)", 600),
    # Precious Metals & Miners
    ("GC=F", "Gold", 6800),
    ("SI=F", "Silver", 180),
    ("GDX", "GDX (Gold Miners ETF)", 180),
    ("GDXJ", "GDXJ (Junior Gold Miners ETF)", 250),
    ("SIL", "SIL (Silver Miners ETF)", 220),
    ("SILJ", "SILJ (Silver Miners Junior ETF)", 90),
]

def get_price_yahoo(ticker: str):
    """Fetch current price from Yahoo Finance API."""
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
        price = meta.get("regularMarketPrice") or meta.get("previousClose")
        return price
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

def main():
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    alerts = []

    print(f"\n=== DaveH Target Monitor | {now} ===\n", flush=True)

    for ticker, name, target in TARGETS:
        price = get_price_yahoo(ticker)
        if price is None:
            print(f"  {ticker:<8} {name:<40} [NO DATA]", flush=True)
            continue

        pct_to_target = (price / target) * 100
        gap_pct = abs(pct_to_target - 100)
        within_5 = gap_pct <= 5

        status = "⚠️ WITHIN 5%" if within_5 else f"{gap_pct:.1f}% to target"
        print(f"  {ticker:<8} {name:<40} {format_price(price):<12} vs {format_price(target)} target ({pct_to_target:.1f}%) [{status}]", flush=True)

        if within_5:
            alerts.append((ticker, name, price, target, pct_to_target))

    # Send Telegram alert if any within 5%
    if alerts:
        lines = [f"🚨 *DaveH Target Alert — Within 5%!*"]
        for ticker, name, price, target, pct in sorted(alerts, key=lambda x: x[4]):
            lines.append(f"• {ticker} ({name}): {format_price(price)} — {pct:.1f}% of target {format_price(target)}")
        lines.append(f"\n_Checked: {now}_")
        msg = "\n".join(lines)
        print(f"\nALERT: {msg}", flush=True)
        _send_telegram(msg)
    else:
        print("\n[OK] No targets within 5%.", flush=True)

def _send_telegram(msg: str):
    """Send via OpenClaw gateway local webhook (Telegram)."""
    import os, urllib.request
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
    except Exception as e:
        print(f"[WARN] Telegram send failed: {e}", flush=True)

if __name__ == "__main__":
    main()
