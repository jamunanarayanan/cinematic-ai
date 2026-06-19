from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import supabase
from app.api.v1 import movies
from app.api.v1 import recommendations
from app.api.v1 import ratings
from app.api.v1 import analytics

app = FastAPI(
    title="CinematicAI API",
    description="AI-powered movie recommendation engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://cinematic-ai-red.vercel.app"
],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(movies.router, prefix="/api/v1/movies", tags=["movies"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])
app.include_router(ratings.router, prefix="/api/v1/ratings", tags=["ratings"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

@app.get("/")
def health_check():
    return {"status": "ok", "service": "CinematicAI API"}

@app.get("/test-db")
def test_db():
    result = supabase.table("movies").select("*").limit(1).execute()
    return {"status": "connected", "data": result.data}