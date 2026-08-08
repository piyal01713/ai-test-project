# Project Management MVP

## Business Requirements

This project is building a Project Management App. Key features:

- A user can sign in
- When signed in, the user sees a Kanban board representing their project
- The Kanban board has fixed columns that can be renamed
- Cards on the Kanban board can be moved with drag and drop, and edited
- There is an AI chat feature in a sidebar; the AI can create, edit, and move one or more cards

## MVP Limitations

- Only one hardcoded user sign-in ("user" / "password"), but the database schema supports multiple users for future expansion
- Only 1 Kanban board per signed-in user
- Runs locally only (no deployment target)

## Technical Decisions

- **Frontend**: Next.js (static export served by the backend)
- **Backend**: Python FastAPI, also serves the static Next.js site at `/`
- **Packaging**: Everything in a single Docker container
- **Python package manager**: uv (inside the Docker container)
- **AI provider**: OpenRouter (model: `openai/gpt-oss-120b`)
- **Database**: SQLite, created automatically if it does not exist
- **Scripts**: Start and stop scripts for Mac, Windows, and Linux in `scripts/`

## Environment Variables

The `.env` file in the project root must contain:

```
OPENROUTER_API_KEY=<your-key>
```

## Project Structure

```
.
├── AGENTS.md            # This file -- project rules for AI agents
├── frontend/            # Next.js frontend (existing MVP demo)
├── backend/             # Python FastAPI backend
├── scripts/             # Start/stop scripts per OS
├── docs/                # Planning and working documentation
│   └── PLAN.md          # Implementation plan
├── .env                 # Environment variables (not committed)
├── Dockerfile
└── docker-compose.yml
```

## Starting Point

A working MVP of the frontend exists in `frontend/`. It is a pure frontend-only demo, not yet integrated with the backend or Docker setup.

## Color Scheme

| Token             | Hex       | Usage                          |
|--------------------|-----------|--------------------------------|
| Accent Yellow      | `#ecad0a` | Accent lines, highlights       |
| Blue Primary       | `#209dd7` | Links, key sections            |
| Purple Secondary   | `#753991` | Submit buttons, important actions |
| Dark Navy          | `#032147` | Main headings                  |
| Gray Text          | `#888888` | Supporting text, labels        |

## Coding Standards

- Use latest stable versions of libraries and idiomatic approaches
- Keep it simple:
  - Never over-engineer
  - Always simplify
  - No unnecessary defensive programming
  - No extra features beyond what is specified
  - Be concise
- Keep README minimal
- No emojis ever

## Fixing Issues

- Always identify the root cause before attempting a fix
- Do not guess
- Prove the cause with evidence, then fix it

## Working Documentation

All planning and execution documents live in the `docs/` directory. Review `docs/PLAN.md` before proceeding with any work.
