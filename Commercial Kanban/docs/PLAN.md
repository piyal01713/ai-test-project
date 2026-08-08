# Implementation Plan

This plan is divided into sequential parts. Each part must be completed, tested, and verified before moving to the next. Check off items as they are completed.

---

## Part 1: Planning and Documentation

Prepare the project for implementation.

- [x] Enrich this plan with detailed sub-steps, checklists, and success criteria for each part
- [x] Create `frontend/AGENTS.md` describing the existing frontend code
- [x] Move `PLAN.md` into `docs/` directory
- [x] Get user approval on the final plan

**Success criteria**: User has reviewed and approved the plan. `docs/PLAN.md` and `frontend/AGENTS.md` exist and are accurate.

---

## Part 2: Docker and Backend Scaffolding

Set up the infrastructure so a minimal app runs end-to-end.

- [x] Create `Dockerfile` using Python + uv, serving a FastAPI app
- [x] Create `docker-compose.yml` with `.env` integration
- [x] Create `backend/` with a minimal FastAPI app that serves a "hello world" HTML page at `/`
- [x] Create `scripts/start.sh`, `scripts/stop.sh` (Linux/Mac)
- [x] Create `scripts/start.bat`, `scripts/stop.bat` (Windows)
- [x] Verify: Docker builds, container starts, "hello world" page is accessible at `http://localhost:<port>/`
- [x] Verify: A test API endpoint (e.g. `GET /api/health`) returns a JSON response

**Success criteria**: Running the start script builds and launches the container. Visiting `/` shows the hello world page. `GET /api/health` returns `{"status": "ok"}`.

---

## Part 3: Serve the Frontend

Replace the placeholder page with the real Next.js frontend.

- [x] Configure Next.js for static export (`next build && next export` or `output: 'export'`)
- [x] Update `Dockerfile` to build the frontend and copy the static output into the backend's served directory
- [x] Update FastAPI to serve the static files at `/`
- [x] Add unit and integration tests for static file serving
- [x] Verify: The Kanban board demo UI loads at `/`

**Success criteria**: The existing frontend demo renders correctly when served through the Docker container.

---

## Part 4: Authentication

Add a fake sign-in experience.

- [x] Add a login page at `/` that prompts for username and password
- [x] Hardcode credentials: username `user`, password `password`
- [x] On successful login, redirect to the Kanban board
- [x] Add a logout button that returns to the login page
- [x] Use JWT or session cookie for auth state
- [x] Add backend auth middleware to protect API routes
- [x] Add tests: valid login, invalid login, protected route access, logout

**Success criteria**: Unauthenticated users see the login page. Valid credentials grant access to the Kanban board. Logout returns to login. Invalid credentials are rejected.

---

## Part 5: Database Schema

Design and document the data model.

- [x] Propose a SQLite schema covering: users, boards, columns, cards
- [x] Save the schema as `docs/schema.json` (or SQL file)
- [x] Document the database approach and migration strategy in `docs/`
- [x] Get user sign-off on the schema

**Success criteria**: Schema supports multiple users and boards (even though MVP uses one of each). User has approved the schema.

---

## Part 6: Backend API

Implement CRUD API routes for the Kanban board.

- [x] Implement database initialization (auto-create tables if DB does not exist)
- [x] Seed default data for the MVP user (board with default columns)
- [x] API routes:
  - [x] `GET /api/board` -- get the board with columns and cards for the authenticated user
  - [x] `PUT /api/columns/:id` -- rename a column
  - [x] `POST /api/cards` -- create a card
  - [x] `PUT /api/cards/:id` -- update a card (title, description, column, position)
  - [x] `DELETE /api/cards/:id` -- delete a card
  - [x] `PATCH /api/cards/:id/move` -- move a card to a different column/position
- [x] Add comprehensive backend unit tests for each route
- [x] Verify: All CRUD operations work via curl or test client

**Success criteria**: All API routes work correctly. Tests pass. Database is created automatically on first run.

---

## Part 7: Frontend-Backend Integration

Connect the frontend to the real backend API.

- [x] Replace frontend mock/demo data with API calls to the backend
- [x] Wire up drag-and-drop to call the move endpoint
- [x] Wire up card create, edit, delete to the corresponding endpoints
- [x] Wire up column rename
- [x] Add integration tests (frontend calls to real backend)
- [x] Verify: Changes persist across page reloads

**Success criteria**: The Kanban board is fully functional with persistent data. All CRUD operations work through the UI. Data survives container restarts (SQLite volume).

---

## Part 8: AI Connectivity

Establish a working AI call through OpenRouter.

- [x] Add OpenRouter client to the backend using the `openai` Python SDK (OpenRouter is compatible)
- [x] Create a test endpoint or script that sends a simple prompt ("What is 2+2?") and returns the response
- [x] Read `OPENROUTER_API_KEY` from `.env`
- [x] Use model `openai/gpt-oss-120b`
- [x] Add a test that verifies the AI responds

**Success criteria**: The backend can make a successful API call to OpenRouter and return a response.

---

## Part 9: AI Structured Kanban Interaction

Give the AI the ability to understand and modify the Kanban board.

- [x] On each AI call, send:
  - The JSON representation of the current Kanban board
  - The user's message
  - Conversation history
- [x] Define a structured output schema for the AI response:
  - `message`: text response to the user
  - `kanban_updates` (optional): list of operations (create/update/move/delete cards)
- [x] Implement backend logic to apply `kanban_updates` to the database
- [x] Store conversation history per user session
- [x] Add thorough tests: AI response parsing, kanban update application, conversation continuity

**Success criteria**: AI receives board context, responds with structured output, and any kanban updates are applied correctly to the database.

---

## Part 10: AI Chat Sidebar UI

Add a polished chat interface to the frontend.

- [x] Add a sidebar panel (collapsible) with a chat UI
- [x] Support sending messages and displaying AI responses
- [x] Display conversation history
- [x] When the AI returns kanban updates, apply them and refresh the board automatically
- [x] Polish: loading states, error handling, smooth animations
- [x] Add tests for the chat flow

**Success criteria**: Users can chat with the AI through a sidebar. When the AI modifies the board, changes appear immediately without a manual refresh. The UI is polished and responsive.
