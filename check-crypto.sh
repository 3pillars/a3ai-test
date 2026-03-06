#!/bin/bash

# Crypto price monitor - fetches from CoinGecko and alerts on thresholds

# Fetch prices (BTC, ETH, SOL, DCR)
RESPONSE=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,decred&vs_currencies=usd&include_24hr_change=true")

# Parse prices
BTC=$(echo "$RESPONSE" | jq -r '.bitcoin.usd // 0')
ETH=$(echo "$RESPONSE" | jq -r '.ethereum.usd // 0')
SOL=$(echo "$RESPONSE" | jq -r '.solana.usd // 0')
DCR=$(echo "$RESPONSE" | jq -r '.decred.usd // 0')

# Parse 24h changes
BTC_CHG=$(echo "$RESPONSE" | jq -r '.bitcoin.usd_24h_change // 0')
ETH_CHG=$(echo "$RESPONSE" | jq -r '.ethereum.usd_24h_change // 0')
SOL_CHG=$(echo "$RESPONSE" | jq -r '.solana.usd_24h_change // 0')
DCR_CHG=$(echo "$RESPONSE" | jq -r '.decred.usd_24h_change // 0')

# Check thresholds
SEND_ALERT=false

if (( $(echo "$DCR > 70" | bc -l) )); then
    SEND_ALERT=true
    REASON="DCR: \$$DCR > \$70"
fi

if (( $(echo "$SOL > 170" | bc -l) )); then
    SEND_ALERT=true
    REASON="${REASON}; SOL: \$$SOL > \$170"
fi

if (( $(echo "$ETH > 4200" | bc -l) )); then
    SEND_ALERT=true
    REASON="${REASON}; ETH: \$$ETH > \$4200"
fi

# Output for cron log
echo "BTC: \$$BTC (${BTC_CHG}%)"
echo "ETH: \$$ETH (${ETH_CHG}%)"
echo "SOL: \$$SOL (${SOL_CHG}%)"
echo "DCR: \$$DCR (${DCHG}%)"
echo "Alert triggered: $SEND_ALERT"
echo "Reason: $REASON"

if [ "$SEND_ALERT" = true ]; then
    MESSAGE="🔔 CRYPTO ALERT%0A%0A"
    MESSAGE+="BTC: \$$BTC (${BTC_CHG}%%)%0A"
    MESSAGE+="ETH: \$$ETH (${ETH_CHG}%%)%0A"
    MESSAGE+="SOL: \$$SOL (${SOL_CHG}%%)%0A"
    MESSAGE+="DCR: \$$DCR (${DCR_CHG}%%)%0A%0A"
    MESSAGE+="Triggered: $REASON"
    
    curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage?chat_id=5157095960&text=$MESSAGE"
fi
