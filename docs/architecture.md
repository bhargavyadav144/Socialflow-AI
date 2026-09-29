# SocialMind AI — System Architecture & Data Flow

## 1. Overview

**SocialMind AI** is an AI-powered Social Media Memory & Strategy Agent designed around **Hindsight** (developed by Vectorize) as its core long-term memory system.

Unlike generic social media tools that output repetitive, context-blind advice, SocialMind AI maintains persistent memory of:
- Creator niche & target audience preferences
- Historical post content, formats, and platforms
- Quantitative performance metrics (views, engagement rates, saves)
- Strategic feedback and experiment outcomes
- Past conversations and decisions

---

## 2. Architectural Topology

```
+-------------------------------------------------------------------------+
|                              FRONTEND                                   |
|               React + Vite + Tailwind CSS + Recharts                    |
+-------------------------------------------------------------------------+
                                   |
                                   | REST API Requests (JSON)
                                   v
+-------------------------------------------------------------------------+
|                           FASTAPI BACKEND                               |
|                     (app/main.py & app/api/routes)                      |
+-------------------------------------------------------------------------+
                                   |
                                   v
+-------------------------------------------------------------------------+
|                        SOCIALMIND AGENT LAYER                           |
|                       (app/agent/reasoning.py)                          |
+-------------------------------------------------------------------------+
                    /                                 \
                   /                                   \
                  v                                     v
+-----------------------------------+   +---------------------------------+
|  STRUCTURED APPLICATION DATABASE  |   |    HINDSIGHT AGENT MEMORY BANK  |
|       (PostgreSQL / SQLite)       |   |       (Vectorize Hindsight)     |
|                                   |   |                                 |
| - users                           |   | - Retain facts & context        |
| - social_posts                    |   | - Recall semantic memories      |
| - content_experiments             |   | - Reflect mental models         |
| - agent_interactions              |   | - Bank ID namespace isolation   |
+-----------------------------------+   +---------------------------------+
                                                        |
                                                        v
                                        +---------------------------------+
                                        |          LLM SERVICE            |
                                        |    Groq (llama-3.3-70b) /       |
                                        |    OpenAI (gpt-4o-mini)         |
                                        +---------------------------------+
```

---

## 3. Core Separation of Responsibilities

### Why PostgreSQL (or SQLite)?
PostgreSQL handles **structured relational application records**:
- Exact tabular database schemas (Users, Posts, Metrics).
- Hard quantitative calculations: engagement rate = `(likes + comments + shares + saves) / views * 100`.
- Chronological ordering, sorting, and user profile metadata.

### Why Hindsight Memory?
Vectorize Hindsight handles **unstructured biomimetic agent memory**:
- Long-term memory retention across multiple chat sessions.
- Semantic recall (`recall()`) matching user queries against past content patterns and audience feedback.
- Reflection (`reflect()`) building qualitative mental models of what content works best for a specific creator.
- Scoped bank isolation (`bank_id = "socialmind_user_1"`) protecting user memory context.

---

## 4. End-to-End Data Flow (Memory Lifecycle)

1. **User Post Addition / Conversation Input:**
   User adds a new post with views/likes/saves or mentions a preference in chat (*"My audience is college students"*).
2. **FastAPI Route Processing:**
   The route delegates execution to `SocialMindAgent`.
3. **Structured Storage:**
   The post metadata is saved into PostgreSQL via SQLAlchemy.
4. **Hindsight Memory Retention:**
   `agent_memory_manager` translates the metrics into a semantic fact and calls `hindsight_service.retain(bank_id, content, category, metadata)`.
5. **Memory Recall on Query:**
   When the user asks *"What should I post next?"*, `agent_reasoning` calls `hindsight_service.recall(query)` to fetch top matching memory facts.
6. **Context Assembly & LLM Generation:**
   Recalled Hindsight facts + DB analytics are injected into the agent system prompt. Groq/OpenAI generates a personalized recommendation.
7. **Transparent Response Return:**
   The response is returned to the React frontend along with a memory usage badge displaying recalled sources.
