from sqlalchemy.orm import Session
from app.agent.reasoning import agent_reasoning
from app.agent.memory import agent_memory_manager
from app.agent.tools import AgentTools

class SocialFlowAgent:
    """
    Main SocialFlow AI Agent Controller interface.
    Decouples API handlers from core agent logic.
    """

    def __init__(self):
        self.reasoning = agent_reasoning
        self.memory = agent_memory_manager
        self.tools = AgentTools()

    def chat(self, db: Session, user_id: int, message: str, disable_memory: bool = False):
        return self.reasoning.process_chat(db, user_id, message, disable_memory)

# Primary instance and backward-compatibility alias
socialflow_agent = SocialFlowAgent()
socialmind_agent = socialflow_agent
SocialMindAgent = SocialFlowAgent
