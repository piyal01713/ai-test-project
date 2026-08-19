from fastapi import APIRouter
from typing import Any, Optional
from pydantic import BaseModel

router = APIRouter()

class StandardResponse(BaseModel):
    status: str
    data: Optional[Any] = None
    message: str

@router.get("/health", response_model=StandardResponse)
async def health_check():
    return StandardResponse(
        status="ok",
        data=None,
        message="Backend is healthy"
    )
