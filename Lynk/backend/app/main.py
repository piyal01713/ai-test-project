from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(title="Lynk Backend", version="1.0.0")

app.include_router(health_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Lynk Backend API"}
