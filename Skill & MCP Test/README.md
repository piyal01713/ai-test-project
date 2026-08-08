# Skill & MCP Test

This directory contains a workspace for configuring and testing an Antigravity Custom Skill and Model Context Protocol (MCP) integrations, specifically focused on browser automation.

## Project Contents

- **`.agents/skills/browser-agent/`**: Contains the custom `browser-agent` skill. This skill provides instructions, runbooks, and automation guidance for:
  - Browser testing
  - UI verification
  - Web scraping
  - Automated interaction using Antigravity Browser capabilities
- **`package.json`**: Installs the required automation dependencies (`playwright` and `puppeteer-core`) to support the browser-agent skill.
- **`.one/`**: Contains local workspace and synchronization configuration profiles (e.g., Jira issue sync).

## Usage

This project acts as a testing ground for developing AI agent skills that interact with the web and perform automated tasks via a headless browser setup.
