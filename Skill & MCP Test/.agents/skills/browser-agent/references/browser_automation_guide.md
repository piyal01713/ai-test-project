# Browser Automation & Testing Reference

## Overview

The Antigravity Browser Agent enables AI-driven web interaction, automated testing, and visual verification.

---

## 1. Core Automation Patterns

### Navigation & Waiting
- **Direct Navigation**: Navigate to `http://localhost:<port>` or external URLs.
- **Wait Strategies**: Wait for `DOMContentLoaded`, network idle state, or specific element visibility before acting.

### Interaction Protocol
- **Click**: Target interactive controls (buttons, links, inputs).
- **Form Input**: Fill inputs, toggle checkboxes, select options.
- **Key Strokes**: Send key combinations (e.g., `Enter`, `Tab`, `Escape`) for keyboard navigation.

### State & Visual Capture
- **Screenshots**: Capture full-page or element-specific screenshots into workspace artifacts.
- **Console Logs**: Capture browser console logs (`console.log`, `console.error`) to diagnose front-end errors.

---

## 2. Playwright Quickstart Template

For standalone automated headless/headed testing scripts:

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to app...');
  await page.goto('http://localhost:3000');
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log('Screenshot saved to screenshot.png');

  await browser.close();
})();
```

---

## 3. Troubleshooting & Safety

- **Timeouts**: Ensure async actions have appropriate timeouts (e.g. 5000ms–10000ms).
- **Isolated Profiles**: Browser automation runs in an isolated context without access to personal stored sessions unless explicitly authorized.
