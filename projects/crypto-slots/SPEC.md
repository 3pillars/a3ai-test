# Vegas Slot Machine Game Specification

## Project Overview
- **Name:** Crypto Slots
- **Type:** Browser-based Vegas-style slot machine
- **Theme:** Luxury casino with crypto symbols
- **Target:** Mobile and desktop

---

## Visual Design

### Color Palette
- Background: Rich dark green (#0d2818) with gold accents
- Reels: Dark wood/mahogany (#2d1810)
- Gold/Chrome accents: #ffd700, #c0c0c0
- Neon signs: Pink (#ff1493), Cyan (#00ffff)

### Symbols (5 reels, 3 visible)
- 💎 Diamond (high)
- 🔮 Crystal Ball (high)
- 🎰 Slot Seven (highest - jackpot)
- 🪙 Crypto Coins (BTC, ETH, SOL)
- 🍒 Cherries (scatter)
- 🔔 Bell
- 🍋 Lemon

### Animations
- Reel spin: Blur effect, deceleration
- Win: Flash, particle burst, coins raining
- Jackpot: Full screen celebration, big win fanfare
- Button press: Glow pulse

---

## Game Mechanics

### Settings
- 5 reels, 3 rows
- 20 paylines
- Bet amounts: 0.01, 0.05, 0.1, 0.5, 1.0
- Max bet button
- Spin button (big, prominent)

### Payouts
| Symbol | 3x | 4x | 5x |
|--------|-----|-----|-----|
| 🎰 7 | 100 | 500 | 1000 |
| 💎 | 50 | 200 | 500 |
| 🔮 | 25 | 100 | 250 |
| 🪙 | 10 | 50 | 100 |
| 🔔 | 5 | 25 | 50 |
| 🍒 | 3 | 15 | 30 |
| 🍋 | 2 | 10 | 20 |

### Features
- Auto-spin option
- Sound toggle
- Balance display
- Win display
- Bet adjustment

---

## Sound Effects

### Required Sounds (Web Audio API synthesized)
- Button click
- Reel spin (mechanical whir)
- Reel stop (click)
- Win (cheerful chime)
- Big win (fanfare)
- Jackpot (celebration)
- Coin drop

---

## Acceptance Criteria

1. ✅ 5 reels with spinning animation
2. ✅ 20 paylines with winning highlights
3. ✅ Bet adjustment (decrease/increase)
4. ✅ Spin button triggers reels
5. ✅ Win detection and payout
6. ✅ Balance tracking
7. ✅ Sound effects with toggle
8. ✅ Smooth animations
9. ✅ Mobile responsive
10. ✅ Vegas casino atmosphere
