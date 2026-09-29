# Hindsight Memory Integration & Configuration Guide

Official Hindsight Resources:
- Documentation: https://hindsight.vectorize.io/
- GitHub: https://github.com/vectorize-io/hindsight
- Vectorize Agent Memory: https://vectorize.io/what-is-agent-memory

---

## 1. Why Hindsight is Needed in SocialMind AI

Standard LLM chatbots operate statelessly: once the context window ends or a new chat opens, past performance learnings, audience feedback, and content topic frequency are forgotten.

Hindsight provides **biomimetic persistent memory** for AI agents:
1. **Retain:** Stores content performance insights and creator preferences without bloating system prompts.
2. **Recall:** Uses semantic and temporal search (TEMPR) to instantly retrieve relevant historical facts.
3. **Reflect:** Synthesizes multiple facts into higher-level mental models.

---

## 2. Hindsight Operations Implemented

### A. Retain (`retain`)
When a new post metric or user preference is recorded, SocialMind calls:
```python
client.retain(
    bank_id="socialmind_user_1",
    content="Short-form Python reels achieve 70k+ views with 9.4% engagement rate.",
    metadata={"category": "performance", "platform": "Instagram"}
)
```

### B. Recall (`recall`)
When a user asks a strategic question, SocialMind calls:
```python
memories = client.recall(
    bank_id="socialmind_user_1",
    query="What content works best for my audience?",
    top_k=5
)
```

### C. Reflect (`reflect`)
Synthesizes recalled context into a reasoned disposition:
```python
reflection = client.reflect(
    bank_id="socialmind_user_1",
    query="Analyze content performance patterns"
)
```

---

## 3. Memory Categories

SocialMind AI categorizes memories into 6 distinct banks:
1. **User Profile Memory:** Niche, brand voice, content goals.
2. **Content Memory:** Previous topics, hooks, captions, platforms.
3. **Performance Memory:** Views, likes, saves, engagement rates.
4. **Audience Memory:** Audience demographic, repeated questions, feedback.
5. **Strategy Memory:** Recommendations accepted/rejected, experiments tried.
6. **Conversation Memory:** Key user decisions mentioned in chat.

---

## 4. Configuration Options

Set environment variables in `.env`:
```env
HINDSIGHT_URL=http://localhost:8888
HINDSIGHT_API_KEY=hsk_demo_key
HINDSIGHT_BANK_ID=socialmind_alex_bank
```

If self-hosting Hindsight locally via Docker:
```bash
docker run -p 8888:8888 vectorize/hindsight:latest
```
