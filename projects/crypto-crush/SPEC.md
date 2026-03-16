# Crypto Match-3 Game Specification

## Project Overview
- **Name:** Crypto Crush
- **Type:** Browser-based match-3 puzzle game
- **Core Functionality:** Swap crypto coins to match 3+ in a row/column, score points, level up
- **Target Users:** Casual gamers, crypto enthusiasts

---

## Visual & Rendering

### Scene Setup
- **Grid:** 8x8 game board
- **Background:** Dark gradient with subtle blockchain/network pattern
- **Camera:** Fixed 2D view

### Materials & Effects
- **Coins:** Colorful crypto icons (BTC orange, ETH purple, SOL gradient, DOGE yellow, BNB gold)
- **Animations:** 
  - Swap animation (300ms ease-out)
  - Match explosion (particle burst)
  - Score popup (+10, +20 floating text)
  - Coin fall animation
- **Visual Style:** Modern, vibrant, playful

### Color Palette
- Background: #1a1a2e → #16213e gradient
- Grid: Semi-transparent dark panels
- Coins: Full color with glow effects

---

## Game Mechanics

### Core Rules
1. Click to select coin, click adjacent to swap
2. Match 3+ same coins in row/column to score
3. Match 4 = special power-up
4. Match 5 = mega combo
5. Moves: 20 per level
6. Target score to pass level

### Scoring
- 3-match: 10 points
- 4-match: 25 points + Rocket power-up
- 5-match: 50 points + Bomb power-up
- Chain combo: 2x multiplier

### Power-ups
- **Rocket:** Clears entire row
- **Bomb:** Clears 3x3 area
- **Lightning:** Clears all of one color

### Levels
- Level 1: Target 500 points, 20 moves
- Level 2: Target 1000 points, 18 moves
- Level 3+: Increasing difficulty

---

## UI Elements

### Header
- Score display (top left)
- Moves counter (top right)
- Level indicator (top center)

### Game Board
- 8x8 grid of crypto coins
- Selected coin highlight
- Invalid move shake animation

### Overlays
- Level Complete popup (score, stars)
- Game Over popup (final score, restart button)
- Settings (sound toggle)

---

## Acceptance Criteria

1. ✅ 8x8 grid displays with 5 crypto coin types
2. ✅ Click to select, click adjacent to swap
3. ✅ Matches 3+ detected and removed
4. ✅ Coins fall to fill gaps
5. ✅ Score updates correctly
6. ✅ Moves decrement on each swap
7. ✅ Level complete when target reached
8. ✅ Game over when moves = 0
9. ✅ Power-ups work (Rocket, Bomb)
10. ✅ Responsive and smooth animations

---

## Technical Implementation

- Single HTML file with embedded CSS/JS
- No external dependencies (vanilla JS)
- Canvas-based rendering for performance
- Local storage for high score
