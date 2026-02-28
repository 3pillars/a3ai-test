# Crypto Trading Platforms Research

**Date:** Feb 28, 2026

---

## Phantom Wallet

### What It Is
- Multi-chain crypto wallet (Solana, Ethereum, Bitcoin, Base, Polygon, Sui, Monad)
- Browser extension + mobile app

### API/Integration Options

| Feature | Available | Notes |
|---------|-----------|-------|
| MCP Server | ✅ YES | "Give AI agents direct access to Phantom wallet operations" |
| SDKs | ✅ | React, React Native, Browser SDK |
| REST API | ❌ Limited | Mainly SDK-based |
| Trading API | ❌ Not for automated trading |

### Use Cases
- Wallet balance monitoring
- Portfolio tracking
- Transaction signing (requires user approval)
- NOT for automated trading

### Verdict: ⚠️ Limited for Trading
Phantom is great for wallet management, but not designed for programmatic trading. The MCP server gives AI access to wallet operations, but requires user approval for transactions.

---

## Hyperliquid

### What It Is
- High-performance L1 blockchain
- Perpetuals (up to 200k orders/second)
- Low fees
- One-block finality

### API/Integration Options

| Feature | Available | Notes |
|---------|-----------|-------|
| REST API | ✅ | Yes |
| WebSocket | ✅ | For real-time data |
| Trading | ✅ | Perps and spot |
| MCP | ❌ Unknown | Not documented |

### Use Cases
- Perpetuals trading (main use)
- Spot trading
- Low-latency trading

### Verdict: ✅ Better for Trading
Hyperliquid has proper APIs for trading. But:
- Mainly perpetuals (higher risk)
- Newer/less established
- Higher risk for passive income goal

---

## Comparison for $5k/mo Goal

| Platform | Pros | Cons | Fit for Goal |
|----------|------|------|--------------|
| **Phantom** | MCP server, multi-chain | No trading API | ⚠️ Monitoring only |
| **Hyperliquid** | API trading, low fees | Perps = higher risk | ⚠️ Higher risk |
| **Coinbase/Binance** | Full API, reliable | Traditional | ✅ Better fit |

---

## Recommendation

**Following first principles:**

1. **Goal:** $5k/mo passive income
2. **Reality:** Need reliable, automated trading

### Best Path Forward:

1. **Start with:** Coinbase/Binance API for reliable automation
2. **Add:** Phantom MCP for wallet monitoring (later)
3. **Consider:** Hyperliquid for perps (only if you want higher risk)

### Why Not Dapps First:
- APIs are more reliable for automation
- Less fragile than browser automation
- Better liquidity on CEXs
- Easier to debug

---

## Next Steps (If You Want to Proceed)

1. Get Coinbase/Binance API keys (with trade permissions)
2. Set up price alerts first
3. Then add execution later

**Remember:** Each trade = your explicit approval required (per security rules)
