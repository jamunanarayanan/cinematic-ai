from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.database import supabase

router = APIRouter()

class RatingCreate(BaseModel):
    user_id: str
    movie_id: int
    rating: float

@router.post("/")
def add_rating(data: RatingCreate):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    result = supabase.table("ratings").upsert({
        "user_id": data.user_id,
        "movie_id": data.movie_id,
        "rating": data.rating,
    }, on_conflict="user_id,movie_id").execute()

    return {"status": "ok", "data": result.data}

@router.get("/user/{user_id}")
def get_user_ratings(user_id: str):
    result = supabase.table("ratings").select(
        "*, movies(id, title, year, genre, imdb_rating)"
    ).eq("user_id", user_id).execute()
    return {"ratings": result.data}

@router.get("/movie/{movie_id}")
def get_movie_ratings(movie_id: int):
    result = supabase.table("ratings").select("*").eq("movie_id", movie_id).execute()
    ratings = [r['rating'] for r in result.data]
    avg = sum(ratings) / len(ratings) if ratings else 0
    return {
        "movie_id": movie_id,
        "average_rating": round(avg, 2),
        "total_ratings": len(ratings)
    }