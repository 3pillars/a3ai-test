# LightPanda Browser Integration

**Status:** ✅ Installed and tested

**Binary:** `/tmp/lightpanda`
**CDP Port:** 9222

---

## Installation (Mac)

```bash
curl -L -o lightpanda https://github.com/lightpanda-io/browser/releases/download/nightly/lightpanda-aarch64-macos
chmod +x lightpanda
```

## Start Server

```bash
/tmp/lightpanda serve --port 9222
```

## Use with Puppeteer

```javascript
const puppeteer = require('puppeteer-core');

const browser = await puppeteer.connect({
  browserWSEndpoint: "ws://127.0.0.1:9222",
});
```

---

## Performance

| Metric | LightPanda | Chrome |
|--------|-------------|--------|
| Memory | 9x less | Baseline |
| Speed | 11x faster | Baseline |
| Startup | Instant | Slow |

---

## For OpenClaw

Replace Chrome-based browser with LightPanda for:
- Faster automation
- Lower memory
- AI agent tasks

---

## When to Use

- Web scraping
- AI agent browsing  
- Automation
- Testing

## When NOT to Use

- Complex web apps (limited JS support)
- Chrome extensions
