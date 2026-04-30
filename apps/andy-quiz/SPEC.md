# Andy's Feelings Quiz App — SPEC.md

## Concept & Vision

A warm, approachable quiz app designed for Andy — a 9-year-old nonverbal autistic savant who communicates through selection. The app transforms abstract 0-10 ratings into tangible, visual choices he can point to, tap, or eye-gaze. The design feels like a playful art installation, not a clinical assessment tool. Every interaction rewards him with satisfying visual/audio feedback.

---

## Design Language

### Aesthetic Direction
Inspired by modern children's museum installations — clean but not sterile, colorful but not overwhelming. Think Pixar color science meets Montessori materials.

### Color Palette
- Background: `#FEF9F3` (warm cream)
- Primary: `#6366F1` (indigo)
- Secondary: `#EC4899` (pink)
- Accent: `#F59E0B` (amber)
- Success: `#10B981` (emerald)
- Text: `#1F2937` (charcoal)
- Text Muted: `#6B7280` (gray)
- Card: `#FFFFFF`

### Typography
- Primary: "Nunito" (rounded, friendly, highly legible)
- Fallback: system-ui, sans-serif
- Scale: 14/16/20/28/40/56px

### Spatial System
- Base unit: 8px
- Cards: 24px padding, 20px border-radius
- Gaps: 16px standard, 24px between sections
- Touch targets: minimum 64px

### Motion Philosophy
- Entrance: Gentle fade + scale (0.95 → 1, 300ms ease-out)
- Selection: Satisfying pulse + color fill (200ms)
- Transitions between questions: Slide + fade (400ms ease-out)
- Success moments: Confetti burst, emoji bounce

### Visual Assets
- Emoji set: Native iOS emoji for consistency
- Icons: Custom SVG (thumbs, stars, faces)
- Gradients: Smooth 5-stop gradients for color scales

---

## Layout & Structure

### Screen Flow
```
[Welcome] → [Category Select] → [Quiz Questions] → [Completion + Stars]
```

### Welcome Screen
- Large friendly header: "Hey Andy! 👋"
- Subtext: "Let's play a feelings game"
- Single "Start" button with bounce animation
- Background: Subtle floating emoji shapes

### Category Screen
- Header: "What do you want to talk about?"
- 3-4 large category cards in 2x2 grid:
  - 🎨 Art & Math
  - 😊 Feelings
  - 🍕 Food & Things
  - 🏃 Activity
- Each card: Icon + label, hover/tap feedback

### Question Screen
- Progress bar at top (thin, colored)
- Question number: "Question 3 of 8"
- Large question text (32px)
- Scale selector below (varies by type)
- "Next" button (appears after selection)

### Completion Screen
- Stars animation (3 stars burst in)
- "You did it! ⭐"
- Summary: "You answered X questions"
- Option to print/share results
- "Play Again" button

---

## Features & Interactions

### Scale Types (User Selectable)

**1. Emoji Scale (Default)**
- 11 emojis in row: 😞🙁😐🙂😊😄😃🤩😍🔥⭐
- Tap to select, selected emoji scales up 1.3x with glow
- Prompt text above: "How do you feel?"

**2. Color Gradient Scale**
- 11 color circles from red to blue
- Tap to select, fills with color + checkmark
- Prompt: "Pick a color"

**3. Thumbs Scale (Chunked)**
- 3 large buttons: 👎 (Bad) | 🤏 (Okay) | 👍 (Great)
- Tap expands to 0-10 sub-scale
- Prompt: "Bad, okay, or good?"

**4. Block Count Scale**
- 3 rows of dots: 1-4 dots | 5-7 dots | 8-10 dots
- Each row expandable to individual numbers
- Uses filled/empty circles: ●○○○○○○○○○

**5. Slider Scale**
- Horizontal track with draggable handle
- Numbers 0-10 labeled below
- Haptic-style bounce at each number
- Visual: Gradient fill from left to handle position

**6. AAC Card Scale**
- Large cards labeled 0, 5, 10
- Optional: 2, 4, 6, 8 as intermediate
- Tap card to select, card lifts with shadow

### Navigation
- Swipe left/right for next/previous (optional)
- Tap "Next" button to advance
- No back button (forward only, reduces anxiety)
- Progress auto-saves to localStorage

### Feedback
- Selection: Emoji bounces, color fills, dots fill
- Correct/complete: Soft chime sound (optional)
- Completion: Confetti burst animation

### Settings (Gear Icon)
- Scale type selector
- Sound on/off
- Font size (normal/large/larger)
- Reset progress

---

## Component Inventory

### Welcome Card
- States: Default, Transitioning out
- Large centered text, floating background shapes
- Single CTA button with pulse animation

### Category Card
- States: Default, Hover, Active, Disabled
- 2x2 grid, equal sizing
- Icon (64px) + label (20px bold)
- Border: 3px solid transparent → primary on hover
- Shadow: subtle → elevated on hover

### Question Card
- States: Entering, Active, Exiting
- Progress bar (top, full width, 4px height)
- Question text (centered, 28px)
- Scale area (dynamic per scale type)
- Next button (bottom, disabled until selection)

### Scale: Emoji Row
- States: Default, Selected (with glow + scale)
- 11 emoji buttons, 56px each, equal spacing
- Selected: scale 1.3x, subtle glow, background circle

### Scale: Color Gradient
- States: Default, Selected (with checkmark)
- 11 color circles, 48px each
- Colors: 🔴🟠🟡🟢🔵🟣⬜ (with gradient steps between)

### Scale: Thumbs Chunk
- States: Default, Expanded
- 3 large thumb buttons (120px)
- Expanded shows 0-10 sub-selection

### Scale: Block Dots
- States: Default, Selected
- 3 rows, expandable
- Filled dots ● and empty ○

### Scale: Slider
- States: Default, Dragging
- Track: 80% width, 8px height, rounded
- Handle: 40px circle, shadow, gradient fill

### Progress Bar
- Thin bar at top
- Animated fill on question change
- Color: primary → success at 100%

### Next Button
- States: Disabled (gray), Enabled (primary), Loading
- Full width, 56px height, rounded
- Text: "Next →" or "Done ✓"

### Completion Star
- States: Inactive, Animating in, Active
- 3 stars, bounce animation on appear
- Gold fill with subtle shimmer

---

## Technical Approach

### Stack
- Single HTML file (self-contained)
- Vanilla CSS with CSS custom properties
- Vanilla JavaScript (no framework needed)
- localStorage for progress persistence

### Architecture
- State machine: welcome → category → question → complete
- Questions loaded from JS object (easily editable)
- Scale rendering abstracted to reusable component
- CSS animations for all motion (GPU accelerated)

### Data Model
```javascript
{
  currentScreen: 'welcome' | 'category' | 'quiz' | 'complete',
  selectedCategory: string | null,
  currentQuestionIndex: number,
  answers: [{ questionId, scaleType, value }],
  settings: { scaleType: string, sound: boolean, fontSize: string }
}
```

### Questions Structure
```javascript
{
  id: string,
  category: string,
  text: string,
  scaleType: 'emoji' | 'color' | 'thumbs' | 'blocks' | 'slider' | 'cards'
}
```

### Accessibility
- Large touch targets (64px minimum)
- High contrast text
- Reduced motion option
- Screen reader labels on all interactive elements

---

## Content: Default Questions

### Category: How Do You Feel?
1. "How are you feeling right now?" (emoji)
2. "How much do you like this?" (color)
3. "How excited are you?" (thumbs)
4. "How calm do you feel?" (blocks)

### Category: Math & Art
1. "How much do you like this picture?" (emoji)
2. "How hard was this problem?" (color)
3. "How good did you do?" (thumbs)
4. "How much do you want more of these?" (slider)

### Category: Things I Like
1. "How much do you like pizza?" (emoji)
2. "How much do you like going outside?" (color)
3. "How much do you like watching videos?" (thumbs)
4. "How much do you like drawing?" (blocks)

### Category: Activities
1. "How much did you like playing this?" (emoji)
2. "How hard was it?" (color)
3. "How much do you want to do it again?" (thumbs)
4. "How tired are you?" (slider)

---

## Polish Details

- Custom scrollbar (thin, primary color)
- Selection color: primary with 20% opacity
- Smooth scroll behavior
- Focus states: 3px primary outline
- Favicon: ⭐ emoji
- Page title: "Andy's Feelings Quiz ⭐"
- Prevent zoom on double-tap (touch-action: manipulation)
- Safe area insets for mobile notch/home indicator