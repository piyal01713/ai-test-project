# Lynk — Product Specification

> **Lynk** is a production-grade, browser-based LAN file transfer application.

## Development Setup

The repository is structured as a monorepo with separate `frontend` and `backend` applications.

### Frontend
The frontend is built with Next.js 15, React 19, and vanilla CSS.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

4. Run tests:
   ```bash
   npm run test
   ```

### Backend
The backend is built with FastAPI and Python 3.12+.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

5. Run tests:
   ```bash
   pytest
   ```
