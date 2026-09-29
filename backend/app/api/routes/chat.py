import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.chat import (
    ChatRequest, ChatResponse, ChatSessionItem, ChatMessageItem,
    ChatSessionCreate, ChatSessionUpdate
)
from app.agent.agent import socialflow_agent
from app.database.models import AgentInteraction, ChatSession, ChatMessage

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_with_agent(req: ChatRequest, db: Session = Depends(get_db)):
    try:
        user_id = req.user_id or 1
        
        # 1. Resolve or Create Chat Session
        session_id = req.session_id
        session = None
        if session_id:
            session = db.query(ChatSession).filter(
                ChatSession.id == session_id,
                ChatSession.user_id == user_id
            ).first()

        if not session:
            session_id = f"session_{uuid.uuid4().hex[:12]}"
            # Generate smart session title from first 6 words of message
            words = req.message.strip().split()
            title_preview = " ".join(words[:6])
            if len(title_preview) > 40:
                title_preview = title_preview[:40] + "..."
            elif not title_preview:
                title_preview = "New Conversation"

            session = ChatSession(
                id=session_id,
                user_id=user_id,
                title=title_preview.capitalize(),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        else:
            session.updated_at = datetime.utcnow()
            # If session has default title and this is a new message, update title
            if session.title in ["New Conversation", "New Chat", ""]:
                words = req.message.strip().split()
                session.title = " ".join(words[:6]).capitalize()
            db.commit()

        # 2. Save User Message to ChatMessage DB
        user_chat_msg = ChatMessage(
            session_id=session.id,
            user_id=user_id,
            sender="user",
            text=req.message,
            created_at=datetime.utcnow()
        )
        db.add(user_chat_msg)
        db.commit()

        # 3. Process with SocialFlow AI Agent
        response_text, memory_used, memory_count, sources, recalled_memories = socialflow_agent.chat(
            db, user_id, req.message, disable_memory=req.disable_memory
        )

        # 4. Save Agent Message to ChatMessage DB
        agent_chat_msg = ChatMessage(
            session_id=session.id,
            user_id=user_id,
            sender="agent",
            text=response_text,
            memory_used=memory_used,
            memory_count=memory_count,
            sources=sources,
            recalled_memories=recalled_memories,
            created_at=datetime.utcnow()
        )
        db.add(agent_chat_msg)

        # 5. Log interaction to Legacy AgentInteraction table for telemetry
        interaction = AgentInteraction(
            user_id=user_id,
            user_message=req.message,
            agent_response=response_text,
            memory_used=memory_used,
            memory_count=memory_count
        )
        db.add(interaction)
        db.commit()

        return ChatResponse(
            response=response_text,
            memory_used=memory_used,
            memory_count=memory_count,
            sources=sources,
            recalled_memories=recalled_memories,
            session_id=session.id,
            session_title=session.title
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Agent process error: {str(e)}")


@router.get("/chat/sessions", response_model=List[ChatSessionItem])
def get_chat_sessions(user_id: int = Query(1), db: Session = Depends(get_db)):
    """Fetch all chat sessions for the user ordered by most recently updated."""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(ChatSession.updated_at.desc()).all()

    result = []
    for s in sessions:
        msgs_count = db.query(ChatMessage).filter(ChatMessage.session_id == s.id).count()
        last_msg = db.query(ChatMessage).filter(ChatMessage.session_id == s.id).order_by(ChatMessage.created_at.desc()).first()
        result.append(ChatSessionItem(
            id=s.id,
            user_id=s.user_id,
            title=s.title or "Conversation",
            message_count=msgs_count,
            last_message=last_msg.text[:60] if last_msg else None,
            created_at=s.created_at,
            updated_at=s.updated_at
        ))
    return result


@router.post("/chat/sessions", response_model=ChatSessionItem)
def create_chat_session(payload: ChatSessionCreate, db: Session = Depends(get_db)):
    """Create a new empty chat conversation session."""
    user_id = payload.user_id or 1
    session_id = f"session_{uuid.uuid4().hex[:12]}"
    session = ChatSession(
        id=session_id,
        user_id=user_id,
        title=payload.title or "New Conversation",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return ChatSessionItem(
        id=session.id,
        user_id=session.user_id,
        title=session.title,
        message_count=0,
        last_message=None,
        created_at=session.created_at,
        updated_at=session.updated_at
    )


@router.get("/chat/sessions/{session_id}/messages", response_model=List[ChatMessageItem])
def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    """Fetch all chat messages in a specific session."""
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()
    return messages


@router.delete("/chat/sessions/{session_id}")
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a chat session and all its messages."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    db.delete(session)
    db.commit()
    return {"status": "deleted", "session_id": session_id}


@router.patch("/chat/sessions/{session_id}")
def update_chat_session(session_id: str, payload: ChatSessionUpdate, db: Session = Depends(get_db)):
    """Rename a chat session."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    session.title = payload.title
    session.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return {"status": "updated", "session_id": session.id, "title": session.title}


@router.delete("/chat/clear")
def clear_all_chat_history(user_id: int = Query(1), db: Session = Depends(get_db)):
    """Clear all chat conversations for user."""
    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete(synchronize_session=False)
    db.query(ChatSession).filter(ChatSession.user_id == user_id).delete(synchronize_session=False)
    db.commit()
    return {"status": "cleared", "user_id": user_id}
