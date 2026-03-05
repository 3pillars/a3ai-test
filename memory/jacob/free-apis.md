# Free API Data Sources for Trading Agent

## Crypto Prices (No API Key Required)

| API | Endpoint | Notes |
|-----|----------|-------|
| **CoinGecko** | `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd` | Free tier: 10-30 calls/min |
| **CryptoCompare** | `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD` | Free, rate limited |
| **CoinCap** | `https://api.coincap.io/v2/assets?ids=bitcoin,ethereum` | Free, no key needed |
| **Blockchain.info** | `https://blockchain.info/stats?format=json` | On-chain stats, blocks, fees |

## Market Data

| API | Endpoint | Notes |
|-----|----------|-------|
| **Fear & Greed Index** | `https://api.alternative.me/fng/` | Sentiment indicator |
| **Blockchair** | `https://api.blockchair.com/bitcoin/stats` | On-chain data |

## Exchange Rates (Backup)

| API | Endpoint | Notes |
|-----|----------|-------|
| **Frankfurter** | `https://api.frankfurter.app/latest?from=USD&to=EUR,GBP` | ECB data, free |
| **Open Exchange Rates** | `https://open.er-api.com/v6/latest/USD` | Free tier |

## APIs Requiring Keys (Optional)

| Service | Use Case | Free Tier |
|---------|----------|-----------|
| **Glassnode** | On-chain metrics | 10% free |
| **CoinAPI** | Aggregated data | Free tier available |
| **CryptoPanic** | News aggregation | Free tier |
| **LunarCrush** | Social sentiment | Free tier |

## Rate Limits (Tested)

- CoinGecko: ~10-30 calls/min (free)
- CryptoCompare: ~100 calls/min
- CoinCap: Generous free tier
- Blockchain.info: No strict limit

## Example Usage

```bash
# BTC price
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"

# Fear & Greed
curl -s "https://api.alternative.me/fng/"

# Multiple prices
curl -s "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,SOL,DCR&tsyms=USD"
```

---

*Last tested: 2026-03-04*
