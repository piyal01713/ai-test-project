import sqlite3
import pytest
from fastapi.testclient import TestClient
from main import app, init_db, DB_FILE

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

client = TestClient(app)

def test_login():
    res = client.post("/api/auth/login", json={"username": "user", "password": "password"})
    assert res.status_code == 200
    assert "token" in res.json()

def test_login_invalid():
    res = client.post("/api/auth/login", json={"username": "user", "password": "wrong"})
    assert res.status_code == 401

def test_get_board_unauthorized():
    res = client.get("/api/board")
    assert res.status_code == 401

def test_get_board_authorized():
    headers = {"Authorization": "Bearer mock-token-user"}
    res = client.get("/api/board", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "columns" in data
    assert len(data["columns"]) > 0

def test_create_and_delete_card():
    headers = {"Authorization": "Bearer mock-token-user"}
    board_res = client.get("/api/board", headers=headers)
    col_id = board_res.json()["columns"][0]["id"]
    
    create_res = client.post("/api/cards", json={"column_id": col_id, "title": "Test Card", "description": "Test Desc"}, headers=headers)
    assert create_res.status_code == 200
    card_id = create_res.json()["id"]
    
    del_res = client.delete(f"/api/cards/{card_id}", headers=headers)
    assert del_res.status_code == 200
