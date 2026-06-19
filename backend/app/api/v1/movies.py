from fastapi import APIRouter, Query, HTTPException
from app.core.database import supabase

router = APIRouter()

@router.get("/")
def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    genre: str = Query(None),
    search: str = Query(None),
):
    offset = (page - 1) * limit
    query = supabase.table("movies").select("*")

    if search:
        query = query.ilike("title", f"%{search}%")

    if genre:
        query = query.ilike("genre", f"%{genre}%")

    result = query.range(offset, offset + limit - 1).execute()
    return {"movies": result.data, "page": page, "limit": limit}


@router.get("/{movie_id}")
def get_movie(movie_id: int):
    result = supabase.table("movies").select("*").eq("id", movie_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Movie not found")
    return result.data


@router.get("/search/titles")
def search_movies(q: str = Query(..., min_length=1)):
    result = supabase.table("movies").select("id, title, year, genre, imdb_rating, poster_url").ilike("title", f"%{q}%").limit(10).execute()
    return {"results": result.data}