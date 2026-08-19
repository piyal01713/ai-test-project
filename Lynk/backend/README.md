# Lynk Backend

The backend of Lynk is built with FastAPI and Python 3.12+.

## Setup

1. Make sure you have Python 3.12+ installed.
2. Navigate to the `backend/` directory.
3. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

Start the development server with hot-reload enabled:
```bash
uvicorn app.main:app --reload
```
The API will be available at http://127.0.0.1:8000.
The health check endpoint is at `GET /api/health`.

## Running Tests

Run the test suite using pytest:
```bash
pytest
```
