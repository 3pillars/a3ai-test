---
name: google-stitch
description: "AI-powered UI design tool from Google Labs that generates HTML/CSS/React code from text prompts or sketches. Use for: rapid UI prototyping, MVPs, design-to-code workflows."
metadata:
  {
    "openclaw":
      {
        "emoji": "🎨",
        "requires":
          {
            "url": "https://stitch.withgoogle.com",
          },
      },
  }
---

# Google Stitch

AI-powered UI design tool from Google Labs that turns prompts into production-ready code.

## What It Does

- **Text → UI:** Describe interface in plain English, get HTML/CSS/React
- **Image → UI:** Upload sketches/wireframes, converts to code
- **Export:** HTML/CSS, React, or Figma (Standard mode only)

## Modes

| Mode | Model | Image Upload | Figma Export | Best For |
|------|-------|--------------|--------------|----------|
| Experimental | Gemini 2.5 Pro | ✅ Yes | ❌ No | Complex/creative |
| Standard | Gemini 2.5 Flash | ❌ No | ✅ Yes | Quick layouts |

## Usage Limits (Free)

- 350 standard screens/month
- 200 pro screens/month

## How to Use

1. **Go to:** stitch.withgoogle.com
2. **Sign in** with Google account
3. **Choose mode:** Mobile or Web
4. **Enter prompt:** Describe your UI
5. **Generate:** Get multiple design variants
6. **Refine:** Chat to edit specific screens
7. **Export:** Download code or send to Figma

## Prompt Examples

```
"Match-3 candy crush game with crypto coins (BTC, ETH, SOL), colorful grid, score display, moves counter"
```

```
"E-commerce app with product grid, cart icon, checkout button, dark theme"
```

```
"Trading dashboard with price charts, buy/sell buttons, portfolio summary"
```

## Limitations

- Experimental mode: No Figma export
- Inconsistent: Components may misalign
- Complex flows: Still need human refinement

## Alternatives

- **UX Pilot** — Figma export in both modes
- **v0** — Vercel's AI UI generator
- **Locofy** — Design to code

---

## When to Use

✅ **Good for:**
- Rapid prototyping
- MVP mockups
- Design-to-code exploration
- Generating UI ideas quickly

❌ **Not for:**
- Production code directly
- Complex interactive apps
- When you need Figma export + image input

---

**Remember:** Use AI-generated UI as a starting point, then refine manually.
