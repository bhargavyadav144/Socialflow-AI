from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, example="What should I post next?")
    user_id: Optional[int] = 1
    session_id: Optional[str] = None
    disable_memory: Optional[bool] = False # Used for Before/After memory demo toggle!

class ChatResponse(BaseModel):
    response: str
    memory_used: bool
    memory_count: int
    sources: List[str] = []
    recalled_memories: List[dict] = []
    session_id: Optional[str] = None
    session_title: Optional[str] = None

class ChatSessionCreate(BaseModel):
    title: Optional[str] = "New Conversation"
    user_id: Optional[int] = 1

class ChatSessionUpdate(BaseModel):
    title: str

class ChatMessageItem(BaseModel):
    id: int
    session_id: str
    sender: str
    text: str
    memory_used: bool = False
    memory_count: int = 0
    sources: Optional[List[str]] = []
    recalled_memories: Optional[List[dict]] = []
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionItem(BaseModel):
    id: str
    user_id: int
    title: str
    message_count: Optional[int] = 0
    last_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
