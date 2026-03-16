# Vegas Slot Machine - Production Spec

## Research Summary: What Makes Vegas Slots Fun

### Core Mechanics
1. **RNG** - Random outcomes, fair but unpredictable
2. **5 Reels x 3 Rows** - Classic Vegas format
3. **9 Paylines** - Multiple ways to win
4. **Bonus Features** - Free spins, wilds, scatters, bonus rounds

### Psychological Triggers (to implement)
1. **Near Miss** - Show "almost won" animations
2. **Celebration on any win** - Even small wins get fanfare
3. **Progress toward bonus** - Visual indicator
4. **Sound design** - Each win triggers unique audio
5. **Visual feedback** - Reels shake, symbols glow

### Features to Include

#### Base Game
- 5 reels, 3 rows
- 9 paylines (classic pattern)
- Bet: $0.09 - $90 (multiple levels)
- Balance display
- Spin button with glow effect

#### Symbols (High to Low)
1. 🎰 BAR (Jackpot) - 3=500x, 2=50x
2. 💎 Diamond - 3=250x, 2=25x  
3. 🔔 Bell - 3=100x, 2=10x
4. 🍒 Cherries - 3=50x, 2=5x
5. 🍋 Lemon - 3=25x
6. 🍇 Grapes - 3=15x
7. 🔷 7 (Seven) - 3=75x

#### Special Symbols
- **WILD (⭐)** - Substitutes for all except scatter
- **SCATTER (🎁)** - 3+ triggers free spins

#### Bonus Features

**1. Free Spins (Triggered by 3+ 🎁)**
- 3🎁 = 10 free spins
- 4🎁 = 15 free spins  
- 5🎁 = 25 free spins
- All wins 2x during free spins

**2. Pick Bonus (Triggered by 3+ 🎯 on payline)**
- Mini game: Pick 3 of 6 chests
- Win: 5x-50x bet multiplier

**3. Progressive Jackpot (Always building)**
- Small: $10-50
- Medium: $100-500
- Grand: $1000+
- Triggered randomly or by 5🎰

#### Sound Design
- Button click
- Reel spin (mechanical)
- Reel stop (click)
- Small win (pleasant chime)
- Big win (fanfare)
- Bonus triggered (excitement)
- Jackpot (full celebration)

#### Visual Effects
- Reel blur during spin
- Symbol highlight on win
- Payline glow animation
- Near-miss animation (teasing)
- Screen flash on big wins
- Particle effects on jackpot

---

## Technical Requirements

### Platform
- Single HTML file
- Mobile responsive
- Touch-optimized
- Works offline (no external deps except fonts)

### Performance
- 60fps animations
- < 3 second initial load
- Smooth reel transitions

### Audio
- Web Audio API
- Synthesized sounds (no external files)
- Volume control

### Browser Support
- Chrome, Safari, Firefox
- iOS Safari, Chrome Android
