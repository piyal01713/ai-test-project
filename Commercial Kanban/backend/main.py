from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sqlite3
import os
import json
from typing import List, Optional
import urllib.request
import urllib.error

DB_FILE = "kanban.db"

app = FastAPI(title="Commercial Kanban API")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS boards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS columns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        position INTEGER NOT NULL,
        FOREIGN KEY (board_id) REFERENCES boards(id)
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        column_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        position INTEGER NOT NULL,
        FOREIGN KEY (column_id) REFERENCES columns(id)
    )
    """)
    cursor.execute("SELECT id FROM users WHERE username = 'user'")
    user = cursor.fetchone()
    if not user:
        cursor.execute("INSERT INTO users (username, password) VALUES ('user', 'password')")
        user_id = cursor.lastrowid
        cursor.execute("INSERT INTO boards (user_id, title) VALUES (?, 'My Kanban Board')", (user_id,))
        board_id = cursor.lastrowid
        cols = ["To Do", "In Progress", "Done"]
        for idx, col_name in enumerate(cols):
            cursor.execute("INSERT INTO columns (board_id, title, position) VALUES (?, ?, ?)", (board_id, col_name, idx))
            col_id = cursor.lastrowid
            if col_name == "To Do":
                cursor.execute("INSERT INTO cards (column_id, title, description, position) VALUES (?, 'Setup Docker', 'Scaffold Docker & FastAPI backend', 0)", (col_id,))
                cursor.execute("INSERT INTO cards (column_id, title, description, position) VALUES (?, 'Build Next.js App', 'Implement drag and drop Kanban frontend', 1)", (col_id,))
            elif col_name == "In Progress":
                cursor.execute("INSERT INTO cards (column_id, title, description, position) VALUES (?, 'Integrate AI Sidebar', 'Connect OpenRouter structured outputs', 0)", (col_id,))
    conn.commit()
    conn.close()

init_db()

class LoginRequest(BaseModel):
    username: str
    password: str

class ColumnRenameRequest(BaseModel):
    title: str

class CardCreateRequest(BaseModel):
    column_id: int
    title: str
    description: Optional[str] = ""

class CardUpdateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    column_id: int
    position: int

class CardMoveRequest(BaseModel):
    column_id: int
    position: int

class AIChatRequest(BaseModel):
    message: str
    history: List[dict] = []

def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or authorization != "Bearer mock-token-user":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return "user"

@app.post("/api/auth/login")
def login(req: LoginRequest):
    if req.username == "user" and req.password == "password":
        return {"token": "mock-token-user", "username": "user"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/board")
def get_board(conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    cursor = conn.cursor()
    cursor.execute("""
    SELECT b.id as board_id, b.title as board_title
    FROM boards b JOIN users u ON b.user_id = u.id
    WHERE u.username = ?
    """, (username,))
    board = cursor.fetchone()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    board_id = board["board_id"]
    cursor.execute("SELECT id, title, position FROM columns WHERE board_id = ? ORDER BY position ASC", (board_id,))
    columns = [dict(c) for c in cursor.fetchall()]
    
    for col in columns:
        cursor.execute("SELECT id, column_id, title, description, position FROM cards WHERE column_id = ? ORDER BY position ASC", (col["id"],))
        col["cards"] = [dict(card) for card in cursor.fetchall()]
        
    return {"id": board_id, "title": board["board_title"], "columns": columns}

@app.put("/api/columns/{column_id}")
def rename_column(column_id: int, req: ColumnRenameRequest, conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    cursor = conn.cursor()
    cursor.execute("UPDATE columns SET title = ? WHERE id = ?", (req.title, column_id))
    conn.commit()
    return {"id": column_id, "title": req.title}

@app.post("/api/cards")
def create_card(req: CardCreateRequest, conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(position) as max_pos FROM cards WHERE column_id = ?", (req.column_id,))
    res = cursor.fetchone()
    next_pos = (res["max_pos"] + 1) if res["max_pos"] is not None else 0
    cursor.execute("INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?)", (req.column_id, req.title, req.description, next_pos))
    conn.commit()
    card_id = cursor.lastrowid
    return {"id": card_id, "column_id": req.column_id, "title": req.title, "description": req.description, "position": next_pos}

@app.put("/api/cards/{card_id}")
def update_card(card_id: int, req: CardUpdateRequest, conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    cursor = conn.cursor()
    cursor.execute("UPDATE cards SET title = ?, description = ?, column_id = ?, position = ? WHERE id = ?", (req.title, req.description, req.column_id, req.position, card_id))
    conn.commit()
    return {"id": card_id, "title": req.title, "description": req.description, "column_id": req.column_id, "position": req.position}

@app.delete("/api/cards/{card_id}")
def delete_card(card_id: int, conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    conn.commit()
    return {"status": "deleted", "id": card_id}

@app.patch("/api/cards/{card_id}/move")
def move_card(card_id: int, req: CardMoveRequest, conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    cursor = conn.cursor()
    cursor.execute("UPDATE cards SET column_id = ?, position = ? WHERE id = ?", (req.column_id, req.position, card_id))
    conn.commit()
    return {"id": card_id, "column_id": req.column_id, "position": req.position}

@app.post("/api/ai/chat")
def ai_chat(req: AIChatRequest, conn: sqlite3.Connection = Depends(get_db), username: str = Depends(verify_token)):
    api_key = os.getenv("OPENROUTER_API_KEY")
    board = get_board(conn=conn, username=username)
    
    if not api_key:
        return {
            "message": "API key for OpenRouter is not set. You can provide `OPENROUTER_API_KEY` in `.env` to enable live AI responses. Mock response: I understand your request!",
            "updates": []
        }
        
    system_prompt = f"""
You are an AI assistant managing a Kanban board.
Current Board JSON:
{json.dumps(board)}

Respond in valid JSON format with keys:
- "message": string (Response text for the user)
- "updates": list of objects (optional changes to the board). Each update object can have:
  - "action": "create" | "edit" | "move" | "delete"
  - "column_id": int (for create/move)
  - "card_id": int (for edit/move/delete)
  - "title": str (for create/edit)
  - "description": str (for create/edit)
  - "position": int (for move)
"""

    messages = [{"role": "system", "content": system_prompt}]
    for h in req.history:
        messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
    messages.append({"role": "user", "content": req.message})

    payload = {
        "model": "openai/gpt-oss-120b",
        "messages": messages,
        "response_format": {"type": "json_object"}
    }
    
    try:
        req_obj = urllib.request.Request(
            "https://openrouter.ai/api/v1/chat/completions",
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
        )
        with urllib.request.urlopen(req_obj) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            raw_content = data["choices"][0]["message"]["content"]
            parsed = json.loads(raw_content)
            
            updates = parsed.get("updates", [])
            cursor = conn.cursor()
            for u in updates:
                act = u.get("action")
                if act == "create":
                    cursor.execute("INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, 99)", (u.get("column_id"), u.get("title", "New Card"), u.get("description", "")))
                elif act == "edit":
                    cursor.execute("UPDATE cards SET title = COALESCE(?, title), description = COALESCE(?, description) WHERE id = ?", (u.get("title"), u.get("description"), u.get("card_id")))
                elif act == "move":
                    cursor.execute("UPDATE cards SET column_id = COALESCE(?, column_id), position = COALESCE(?, position) WHERE id = ?", (u.get("column_id"), u.get("position", 0), u.get("card_id")))
                elif act == "delete":
                    cursor.execute("DELETE FROM cards WHERE id = ?", (u.get("card_id"),))
            conn.commit()
            
            return {
                "message": parsed.get("message", "Board updated."),
                "updates": updates
            }
    except Exception as e:
        return {
            "message": f"OpenRouter AI request failed or key not configured properly ({str(e)}).",
            "updates": []
        }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# Mount frontend build static files if present
static_dir = os.path.join(os.path.dirname(__file__), "out")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
