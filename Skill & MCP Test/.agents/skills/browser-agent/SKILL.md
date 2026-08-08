---
name: browser-agent
description: >-
  Provides instructions, runbooks, and automation guidance for browser testing, UI verification, web scraping, and automated interaction using Antigravity Browser capabilities and Playwright. Activate this skill when the user requests website testing, UI verification, web browsing automation, or visual debugging.
---

# Browser Agent Skill

This skill provides step-by-step procedures and guidelines for executing automated browser tasks, testing web applications, verifying visual UI states, and inspecting page interactions.

---

## 1. Primary Workflows

### Workflow A: Visual UI & Web Testing
1. **Prepare Environment**: Ensure local web server is running or target URL is accessible.
2. **Launch & Navigate**: Direct the browser agent to the target URL.
3. **Execute Actions**: Interact with DOM elements (click, type, scroll, wait).
4. **Capture & Verify**: Take screenshots of critical UI states and verify expected DOM elements.

### Workflow B: Web Scraping & Data Extraction
1. **Load Page**: Navigate to target page and wait for full render or network idle.
2. **DOM Inspection**: Extract semantic text, links, or structured elements.
3. **Process Output**: Save extracted data to workspace artifacts or local files.

---

## 2. Best Practices & Guidelines

- **Element Selectors**: Prefer robust selectors in order of priority:
  1. `id` or `data-testid` attributes
  2. Accessible ARIA roles (`role="button"`, `aria-label`)
  3. Unique CSS selectors or concise XPath expressions
- **Security Boundary**: Operating within isolated browser contexts. Respect local allowlist/denylist rules.
- **Verification**: Always inspect returned page content or capture screenshots after state-changing interactions to confirm success.

---

## 3. Reference Documentation

For detailed references and advanced Playwright integration scripts, see:
- [Browser Automation Guide](references/browser_automation_guide.md)
