# Lynk — Product Specification

> **Lynk** is a production-grade, browser-based LAN file transfer application. It lets users on the same local network send and receive files instantly through a stunning, drag-and-drop web interface — no internet, no cloud, no accounts. Think AirDrop, but cross-platform and running in any modern browser.

---

## Vision

A beautiful, zero-configuration file sharing experience for local networks. The user launches Lynk, opens a browser, and starts transferring files to any device on the same LAN. Every interaction — from device discovery to transfer completion — must feel polished, responsive, and premium.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) + React 19 + TypeScript | Server components where beneficial, client interactivity for transfers |
| **Styling** | Vanilla CSS (design-token-based system) | Custom properties for colors, spacing, typography. No Tailwind. |
| **Backend** | Python 3.12+ with FastAPI | Async, high-performance HTTP + WebSocket API |
| **Real-Time** | WebSockets (native FastAPI + browser WebSocket API) | Live progress, device heartbeats, transfer events |
| **File Transfer** | HTTP chunked streaming over LAN | Chunk-based with integrity verification |
| **Device Discovery** | UDP broadcast / mDNS on the local network | Zero-config peer detection |
| **Hashing** | BLAKE3 (via `blake3` pip package) | Fast cryptographic checksums for chunk + full-file integrity |
| **Package Manager** | npm (frontend), pip / uv (backend) | — |
| **Testing** | Vitest (frontend), pytest (backend) | — |

---

## Core Features

### 1. Device Discovery & Pairing
- On launch, the backend broadcasts its presence on the LAN via UDP.
- The web UI shows a **live device list** — each peer displayed as a card with its hostname, OS icon, and IP address.
- Devices appear and disappear in real time (heartbeat-based, with smooth entry/exit animations).
- No manual IP entry required (but available as a fallback in settings).

### 2. File Transfer — Send & Receive
- **Drag-and-drop zone** dominates the UI. Users can also click to open a native file picker.
- Files are chunked (configurable, default 4 MB), streamed over HTTP, and reassembled on the receiving end.
- Each chunk is verified with a BLAKE3 hash on arrival. Corrupted chunks are automatically re-requested.
- A final full-file BLAKE3 hash is verified after reassembly.
- **Multiple simultaneous transfers** are supported (queued or parallel).

### 3. Real-Time Progress & Feedback
- **Per-file progress bar** with: percentage, transfer speed (MB/s), ETA, and bytes transferred.
- **Overall transfer progress** when sending multiple files.
- Smooth, animated progress bars — not jumpy or flickering.
- Clear status indicators: Queued → Transferring → Verifying → Complete / Failed.
- Toast notifications on transfer complete or error.

### 4. Transfer History
- A scrollable **activity log** showing recent transfers (sent and received).
- Each entry shows: filename, size, peer device, timestamp, status (success/failed), and duration.
- History is stored in-memory (clears on restart — no persistent database required for v1).

### 5. Resilience & Auto-Resume
- If a connection drops, the transfer pauses and automatically retries with exponential backoff.
- A `.lynk_progress` file tracks completed chunks so transfers can be manually resumed by re-initiating.
- Graceful handling of: peer going offline mid-transfer, network interface changes, browser tab closure.

### 6. Settings Panel
- Toggle dark/light theme (system preference respected by default).
- Configure chunk size.
- Set a custom device display name.
- Manual IP connection fallback.
- Download directory selection.

---

## UI / UX Requirements

> **This is not a prototype. The UI must be indistinguishable from a shipped, premium product.**

### Layout
- **Single-page application** with a clean, minimal layout.
- Left sidebar (collapsible): Device list + settings access.
- Main content area: The transfer zone (drag-and-drop area, active transfers, history).
- Top bar: App logo/name, current device identity, theme toggle.

### Visual Design
- **Color palette**: A refined, muted palette. Light mode with warm neutrals; dark mode with deep charcoal tones. A single accent color (e.g., a calm teal or soft blue) for interactive elements.
- **Typography**: Use `Inter` from Google Fonts. Clear hierarchy: bold headings, regular body, monospace for technical details (file sizes, IPs).
- **Spacing**: Generous whitespace. Nothing should feel cramped.
- **Depth**: Subtle shadows, layered card surfaces, and gentle elevation changes — not flat, not skeuomorphic.
- **Border radius**: Consistently rounded (8–12px for cards, 6px for buttons, full-round for avatars/icons).

### Micro-Interactions & Animation
- Drag-over state: The drop zone glows and scales subtly.
- File cards animate in on arrival (fade + slide-up).
- Progress bars have smooth CSS transitions (not stepped).
- Device cards pulse gently when a new device is discovered.
- Toast notifications slide in from the top-right and auto-dismiss.
- Theme toggle has a smooth crossfade transition.
- Buttons have tactile hover/press states (slight scale + shadow change).

### Responsiveness
- Fully responsive: works on desktop browsers, tablets, and phones on the LAN.
- Sidebar collapses to a hamburger menu on small screens.
- The drag-and-drop zone adapts to available space.

### Accessibility
- All interactive elements are keyboard-navigable.
- Proper ARIA labels on buttons, inputs, and dynamic regions.
- Color contrast meets WCAG AA.
- Focus rings visible on keyboard navigation.

---

## API Design (Backend)

### REST Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/devices` | List discovered LAN peers |
| `POST` | `/api/transfer/send` | Initiate a file send to a peer |
| `POST` | `/api/transfer/receive` | Accept an incoming file (receiver endpoint) |
| `GET` | `/api/transfer/{id}/status` | Get transfer status |
| `GET` | `/api/history` | Get recent transfer history |
| `GET` | `/api/settings` | Get current settings |
| `PUT` | `/api/settings` | Update settings |

### WebSocket
| Endpoint | Purpose |
|---|---|
| `ws://host:port/ws/events` | Real-time events: device discovery, transfer progress, completion, errors |

### Data Contracts
- All responses are JSON with consistent shape: `{ "status": "ok" | "error", "data": ..., "message": "..." }`
- Proper HTTP status codes (200, 201, 400, 404, 409, 500).
- Transfer IDs are UUIDs.

---

## File & Directory Structure

```
Lynk/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages & layouts
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities, API client, constants
│   │   ├── styles/            # Global CSS, design tokens, component styles
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── api/               # Route handlers
│   │   ├── core/              # Business logic (transfer engine, discovery)
│   │   ├── models/            # Pydantic models / schemas
│   │   └── utils/             # Helpers (hashing, chunking, networking)
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
├── product.md
├── .agents/
└── .github/
```

---

## Non-Functional Requirements

- **Performance**: Transfers should saturate available LAN bandwidth. The UI must render at 60fps during active transfers.
- **Security**: All traffic is LAN-only. No data leaves the local network. Input validation on all API endpoints.
- **Cross-Platform**: Works on any OS with Python 3.12+ and a modern browser (Chrome, Firefox, Safari, Edge).
- **Zero Config**: Launch the backend, open the browser — it works. No accounts, no setup wizards, no cloud dependencies.
