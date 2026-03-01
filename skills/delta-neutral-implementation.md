# Delta Neutral Bot - Implementation Guide

## Quick Start

### Prerequisites
- Exchange account (Binance recommended)
- API keys with read + trade permissions
- Initial capital ($100+)

### Step 1: API Setup
```bash
# Test API connection (example with curl)
curl "https://api.binance.com/api/v3/account" \
  -H "X-MBX-APIKEY: YOUR_API_KEY"
```

### Step 2: Basic Monitoring Script
```python
#!/usr/bin/env python3
"""
Delta Neutral Position Monitor
"""

import requests
import time
import json

# Configuration
API_KEY = "YOUR_API_KEY"
SECRET_KEY = "YOUR_SECRET_KEY"
SYMBOL = "BTCUSDT"
HEDGE_RATIO = 1.0  # 1:1 hedge
DRIFT_THRESHOLD = 0.05  # 5% drift triggers rebalance

def get_positions():
    """Get current positions from exchange"""
    # Implement with your exchange API
    pass

def calculate_delta(spot_qty, futures_qty):
    """Calculate position delta"""
    return spot_qty - (futures_qty * HEDGE_RATIO)

def rebalance_if_needed():
    """Rebalance if delta drifts too far"""
    delta = calculate_delta(spot, futures)
    if abs(delta) > DRIFT_THRESHOLD:
        print(f"⚠️ Rebalancing needed! Delta: {delta}")
        # Execute rebalance
    else:
        print(f"✅ Delta OK: {delta}")

# Main loop
while True:
    rebalance_if_needed()
    time.sleep(60)  # Check every minute
```

### Step 3: Funding Rate Monitor
```python
def get_funding_rate(symbol):
    """Get current funding rate"""
    # Binance API: /api/v3/premiumIndex
    url = f"https://api.binance.com/api/v3/premiumIndex?symbol={symbol}"
    data = requests.get(url).json()
    return float(data['lastFundingRate']) * 100  # As percentage

# Check funding
rate = get_funding_rate("BTCUSDT")
print(f"Funding rate: {rate}% (next funding in ~{get_hours_until_funding()}h)")
```

---

## Bot Checklist

### Before Running
- [ ] API keys created
- [ ] IP whitelist configured
- [ ] Withdrawal permissions OFF
- [ ] Paper trading tested
- [ ] Position limits set
- [ ] Alert thresholds configured

### Daily Checks
- [ ] Funding collected
- [ ] Delta within threshold
- [ ] No liquidation warnings
- [ ] Balance matches expected

### Emergency Contacts
- Exchange support: _______
- Your phone: _______

---

## Sample Alert Thresholds

| Alert | Value |
|-------|-------|
| Delta drift | > 5% |
| Funding rate | < 0.01% |
| Position size | > 80% margin |
| 24h P&L | < -5% |

---

## Useful Commands

### Check Positions
```bash
# Binance
curl "https://api.binance.com/api/v3/account" -H "X-MBX-APIKEY: $API_KEY"
```

### Check Funding
```bash
curl "https://api.binance.com/api/v3/premiumIndex?symbol=BTCUSDT"
```

### Check Open Orders
```bash
curl "https://api.binance.com/api/v3/openOrders" -H "X-MBX-APIKEY: $API_KEY"
```
