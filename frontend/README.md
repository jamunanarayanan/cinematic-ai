# 🎬 CinematicAI — Hybrid Movie Recommendation Platform

A full-stack, production-deployed AI movie recommendation system combining
**content-based filtering**, **collaborative filtering**, and a **hybrid engine**
with explainable AI, mood-based discovery, and a real-time analytics dashboard.

🔗 **Live Demo:** https://cinematic-ai-red.vercel.app
🔗 **API Docs:** https://cinematic-ai-backend.onrender.com

---

## 🧠 Key Features

- **Hybrid Recommendation Engine** — blends TF-IDF content similarity with
  collaborative filtering (user-based cosine similarity)
- **Explainable AI** — every recommendation includes a human-readable reason
  (e.g. "Similar Sci-Fi themes to Inception")
- **Mood-Based Discovery** — get recommendations by mood (Happy, Mind-bending,
  Motivational, Romantic, Action, Scary)
- **Cold-Start Handling** — new users get popularity-based recommendations
  until enough rating data exists
- **Analytics Dashboard** — visualizes rating distribution and genre
  preferences with Recharts
- **Real Movie Posters** — fetched live from TMDB API
- **Secure Auth** — Supabase Auth with protected routes
- **Confidence Scoring** — every recommendation includes a match percentage

---

## 🏗️ Architecture

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Framer Motion, Recharts |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| ML | scikit-learn (TF-IDF, Cosine Similarity) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🤖 ML Engine Details

### Content-Based Filtering
- TF-IDF vectorization over movie titles, genres, and plot summaries
- Cosine similarity to find the closest semantic matches
- Trained on 4,800+ real movies (TMDB dataset)

### Collaborative Filtering
- User-based cosine similarity over the ratings matrix
- Finds users with similar taste, recommends what they rated highly

### Hybrid Engine
- Weighted blend: 60% content-based + 40% collaborative
- Falls back to popularity-based recommendations for new users (cold start)
- Mood filter applies genre-mapping on top of the blended score

---

## 📂 Project Structure

\```
cinematic-ai/
├── frontend/          # React + Vite app
│   └── src/
│       ├── api/        # API layer
│       ├── components/ # Reusable UI components
│       ├── pages/       # Route pages
│       ├── store/       # Zustand state
│       └── lib/         # Supabase client
├── backend/            # FastAPI app
│   └── app/
│       ├── api/v1/      # Route handlers
│       ├── ml/           # ML engines (content, collaborative, hybrid)
│       ├── core/         # Config + DB connection
│       └── main.py
\```

---

## 🚀 Running Locally

### Backend
\```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
\```

### Frontend
\```bash
cd frontend
npm install
npm run dev
\```

### Environment Variables
Create `.env` files in both `frontend/` and `backend/` — see `.env.example`
in each folder for required keys (Supabase, TMDB).

---

## 📊 API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/v1/movies/` | List/search movies |
| `GET /api/v1/recommendations/similar/{id}` | Content-based similar movies |
| `GET /api/v1/recommendations/hybrid` | Hybrid recommendations |
| `GET /api/v1/recommendations/mood/{mood}` | Mood-based recommendations |
| `POST /api/v1/ratings/` | Submit a movie rating |
| `GET /api/v1/analytics/user/{id}` | User analytics dashboard data |

Full interactive docs available at `/docs` (Swagger UI).

---

## 👤 Author

Built by N Jamuna — VIT Computer Science