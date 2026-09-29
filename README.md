# SocialFlow AI — AI-Powered Social Media Memory & Strategy Agent

[![Hindsight Memory](https://img.shields.io/badge/Memory-Vectorize%20Hindsight-8b5cf6)](https://hindsight.vectorize.io/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-61dafb)](https://react.dev/)

**SocialFlow AI** is an AI-powered Social Media Memory & Strategy Agent built for content creators, influencers, small businesses, and marketing teams.

Unlike generic AI tools that give repetitive, context-blind advice, SocialFlow AI maintains **persistent long-term memory** of creator content history, audience preferences, performance metrics, and past strategic decisions using **Hindsight** (developed by Vectorize).

---

## 🌟 Official Hindsight Resources
- **Hindsight Documentation:** [https://hindsight.vectorize.io/](https://hindsight.vectorize.io/)
- **Hindsight GitHub:** [https://github.com/vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **Vectorize Agent Memory:** [https://vectorize.io/what-is-agent-memory](https://vectorize.io/what-is-agent-memory)

---

## ❓ The Problem

Standard AI assistants operate statelessly. When a creator asks *"What should I post next?"*, traditional LLMs give generic, repetitive advice:
> *"Create a video about top 5 growth tips with trending music."*

They fail to remember that:
- Your short-form Python coding walk-throughs reached 72,000 views, while generic promo posts got under 1.8% engagement.
- Your primary audience consists of college students requesting beginner debugging tutorials.
- You already posted about basic syntax setup two weeks ago.

---

## 💡 The Solution: Persistent Biomimetic Agent Memory

**SocialFlow AI** integrates **Vectorize Hindsight** directly into the agent reasoning workflow. Every meaningful interaction, post metric, and user preference creates durable memory facts in Hindsight memory banks (`bank_id`).

### The Before vs After Hindsight Difference:

| Feature | Without Hindsight Memory | With SocialFlow AI (Hindsight Memory) |
|---|---|---|
| **Response Style** | Generic social media advice | Tailored to your exact audience & post history |
| **Historical Context** | Forgotten after session ends | Recalls 70k+ view Python reel performance |
| **Topic Gap Detection** | Suggests topics you already covered | Recommends uncovered high-potential gaps |
| **Performance Alignment** | Ignores low-engagement formats | Recommends short tutorials over generic promos |

---

## 🧠 Memory Strategy (6 Categories)

SocialFlow AI organizes memory facts across 6 distinct categories:
1. **User Profile Memory:** Creator niche, brand voice, content goals.
2. **Content Memory:** Topics, hooks, captions, platforms, formats.
3. **Performance Memory:** Views, likes, comments, shares, saves, engagement rates.
4. **Audience Memory:** Audience demographic, repeated questions, feedback.
5. **Strategy Memory:** Recommendations accepted/rejected, past experiments.
6. **Conversation Memory:** Important goals and preferences mentioned in chat.

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Python 3.11, FastAPI, Pydantic v2, Uvicorn
- **AI Agent:** Fine-tuned Qwen2.5-0.5B (LoRA) + Groq/Gemini API support
- **Agent Memory:** Vectorize Hindsight (`retain`, `recall`, `reflect`)
- **Database:** PostgreSQL (with SQLite fallback for zero-config local dev)

```
[ React + Vite UI ] ──REST──> [ FastAPI Backend ]
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
        [ PostgreSQL Database ]          [ Vectorize Hindsight ]
       (Structured Posts & Stats)        (Agent Memory Bank)
```

---

## ⚡ Quick Start & Local Running

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Clone & Environment Setup
```bash
git clone https://github.com/bhargavyadav144/Socialflow-AI.git
cd Socialflow-AI

# Copy environment example
cp backend/.env.example backend/.env
```

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt

# Run automated test suite
python -m pytest

# Start FastAPI dev server (runs auto-seeding for demo user Alex)
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000/api/health`

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend Web UI will be live at: `http://localhost:5173`

---

## 🔑 Environment Variables (`.env`)

```env
# LLM Configuration (local model - no API key needed)
LLM_PROVIDER=local
LLM_API_KEY=
LLM_MODEL=Qwen/Qwen2.5-0.5B-Instruct

# Hindsight Vectorize Memory Settings
HINDSIGHT_URL=http://localhost:8888
HINDSIGHT_API_KEY=hsk_your_key_here
HINDSIGHT_BANK_ID=socialflow_user_bank

# Database URL
DATABASE_URL=sqlite:///./socialflow.db
```

---

## 🧪 ML Training & Testing Pipeline

SocialFlow AI includes a complete fine-tuning pipeline using **LoRA (Low-Rank Adaptation)** on **Qwen2.5-0.5B-Instruct**.

### Dataset
- **Training**: 5,235 instruction-response pairs (`ml_pipeline/data/train.json`)
- **Validation**: Used during training to monitor overfitting (`ml_pipeline/data/val.json`)
- **Testing**: 5,000 completely unseen test samples (`ml_pipeline/data/test_from_jsonl.json`)

### Train the Model
```bash
python ml_pipeline/train.py
```
This fine-tunes the Qwen 0.5B base model with LoRA (r=8, alpha=16) on social media analytics tasks. The trained adapter is saved to `ml_pipeline/models/socialflow_lora_adapter/`.

### Evaluate (Base vs Fine-Tuned)
```bash
python ml_pipeline/evaluate_model.py
```
Runs side-by-side comparison on 50 randomly sampled unseen test items, measuring:
- Performance Level Accuracy (High/Medium/Low classification)
- Engagement Rate Match
- Metric Coverage (likes, comments, shares, saves, views)
- Strategic Quality Score

Results are saved to `ml_pipeline/evaluation_results.json`.

---

## 🎬 5-Minute Demo Walkthrough

1. **Open Landing Page:** View architecture flow and Hindsight integration summary.
2. **Explore Dashboard:** Inspect creator's historical posts and engagement metrics.
3. **Open Memory Demo Tab (`/demo`):**
   - Click **Run Step 1** to ask *"What should I post next?"* without memory (Generic result).
   - Inspect Hindsight facts loaded into the user's memory bank.
   - Click **Run Step 4** to ask the exact same question with Hindsight enabled. Observe the personalized recommendation!
4. **Inspect Hindsight Memory Vault (`/memory`):** View all 6 memory categories and search retained facts.
5. **Add Post & Metrics (`/content`):** Add a new post with views/likes/saves; observe automatic Hindsight retention.

---

## 🔌 API Endpoints Summary

- `GET /api/health` — System health and Hindsight status
- `POST /api/chat` — Send chat message to SocialFlow AI (supports `disable_memory=true` for demo baseline)
- `GET /api/posts` — Retrieve social post history with engagement metrics
- `POST /api/posts` — Add social post & trigger automatic Hindsight memory retention
- `GET /api/analytics` — Calculate engagement rates, top posts, and AI insights
- `GET /api/memory` — Retrieve Hindsight memory overview & categorised facts
- `POST /api/memory` — Manually retain memory fact in Hindsight
- `POST /api/demo/reset` — Reset database and re-seed demo dataset

---

## 📜 Documentation

- [`docs/architecture.md`](docs/architecture.md) — Architectural topology & data separation
- [`docs/hindsight.md`](docs/hindsight.md) — Detailed Vectorize Hindsight integration guide
- [`docs/demo-script.md`](docs/demo-script.md) — Step-by-step presentation script

---

## 🛡️ License & Acknowledgements
Built with [Vectorize Hindsight](https://vectorize.io) for persistent AI agent memory.
