from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.agent.tools import AgentTools
from app.agent.memory import agent_memory_manager
from app.agent.prompts import SYSTEM_PROMPT, NO_MEMORY_SYSTEM_PROMPT
from app.services.llm_service import llm_service

class AgentReasoning:
    """
    Coordinates context assembly, tool execution, Hindsight memory retrieval,
    and LLM generation for SocialMind AI.
    """

    @staticmethod
    def process_chat(db: Session, user_id: int, message: str, disable_memory: bool = False) -> Tuple[str, bool, int, List[str], List[dict]]:
        """
        Processes a chat request.
        Returns: (response_text, memory_used, memory_count, sources, recalled_memories)
        """
        # NO_MEMORY_MODE (Used in Before/After Hackathon Demo comparison)
        if disable_memory:
            sys_prompt = NO_MEMORY_SYSTEM_PROMPT
            user_prompt = f"User asks: '{message}'\nAnswer without using any past memory context."
            response_text = llm_service.generate(sys_prompt, user_prompt)
            return response_text, False, 0, ["No memory used (Demo baseline)"], []

        # 1. Recall Hindsight Memory
        recalled = agent_memory_manager.recall_context(user_id, message, top_k=5)
        
        # 2. Query Structured DB Tools & Trained Multiplatform Dataset Intelligence
        audience_info = AgentTools.get_audience_profile(db, user_id)
        top_content = AgentTools.find_top_performing_content(db, user_id, limit=3)
        recent_posts = AgentTools.get_recent_posts(db, user_id, limit=5)

        from app.services.dataset_intelligence_service import dataset_intelligence_service
        dataset_hooks = dataset_intelligence_service.find_top_hooks(limit=3)
        trained_hook_examples = "; ".join([f"[{h['platform']} {h['content_type']}]: \"{h['hook']}\" ({h['engagement_rate']}% Eng)" for h in dataset_hooks])

        # 3. Assemble Context
        memory_lines = []
        sources = set()

        for m in recalled:
            content = m.get("content", "")
            cat = m.get("category", "memory")
            if content:
                memory_lines.append(f"- [{cat.upper()}]: {content}")
                sources.add(f"{cat.replace('_', ' ').title()} Memory")

        if not memory_lines:
            memory_lines.append("- No specific Hindsight memory matching query yet.")

        # Search specifically for posts related to the user's query keywords
        from app.database.models import SocialPost
        matching_posts = []
        words = [w for w in message.lower().replace("?", "").replace("!", "").split() if len(w) > 3 and w not in ["what", "when", "where", "which", "about", "write", "post", "video", "reel", "give", "make", "tell", "analyze", "why", "did", "my", "your"]]
        if words:
            for word in words:
                found = db.query(SocialPost).filter(
                    SocialPost.user_id == user_id,
                    (SocialPost.title.ilike(f"%{word}%") | SocialPost.caption.ilike(f"%{word}%") | SocialPost.topic.ilike(f"%{word}%"))
                ).order_by(SocialPost.views.desc()).limit(3).all()
                for p in found:
                    if not any(mp.id == p.id for mp in matching_posts):
                        matching_posts.append(p)

        matched_posts_summary = "; ".join([f"'{p.title}' ({p.platform} {p.content_type}, {p.views:,} views, {p.likes:,} likes, {p.comments:,} comments, {p.engagement_rate}% eng)" for p in matching_posts])

        top_posts_summary = "; ".join([f"'{p['title']}' ({p['topic']}, {p['views']:,} views, {p['engagement_rate']}% eng)" for p in top_content])
        recent_posts_summary = "; ".join([f"'{p['title']}' ({p['platform']} {p['content_type']})" for p in recent_posts])

        context_str = f"""
=== USER PROFILE & AUDIENCE ===
Name: {audience_info.get('name')}
Niche: {audience_info.get('niche')}
Target Audience: {audience_info.get('target_audience')}
Brand Voice: {audience_info.get('brand_voice')}

=== SPECIFIC MATCHING POSTS FOUND IN DATABASE ===
{matched_posts_summary if matched_posts_summary else 'No exact title keyword matches found.'}

=== TOP PERFORMING POSTS (CREATOR HISTORY) ===
{top_posts_summary if top_posts_summary else 'No posts recorded yet.'}

=== RECENT POST HISTORY ===
{recent_posts_summary if recent_posts_summary else 'No recent posts.'}

=== RECALLED HINDSIGHT MEMORIES ===
{chr(10).join(memory_lines)}

=== TRAINED 10,000 MULTIPLATFORM DATASET INTELLIGENCE & VIRAL HOOKS ===
Top algorithmic viral hook patterns from trained dataset:
{trained_hook_examples}
"""

        full_user_prompt = f"USER QUESTION: {message}\n\nCONTEXT:\n{context_str}\n\nPlease generate a highly strategic, data-backed response combining the creator's real content telemetry with the trained multiplatform algorithmic models."

        # 4. Generate LLM Completion
        response_text = llm_service.generate(SYSTEM_PROMPT, full_user_prompt)
        sources.add("10K Multiplatform Trained LLM Model")

        # 5. Extract and Retain new user facts from this conversation step
        agent_memory_manager.auto_extract_and_retain(db, user_id, message)

        if not sources:
            sources.add("Audience Profile")
            sources.add("Content History")

        return response_text, True, len(recalled), list(sources), recalled

agent_reasoning = AgentReasoning()
