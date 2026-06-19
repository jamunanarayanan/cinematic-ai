from fastapi import APIRouter, Query, HTTPException
from app.ml.content_based import content_engine
from app.ml.collaborative import collaborative_engine
from app.ml.hybrid import hybrid_engine

router = APIRouter()

@router.get("/similar/{movie_id}")
def get_similar_movies(movie_id: int, top_n: int = Query(10, le=20)):
    try:
        results = content_engine.get_similar_movies(movie_id, top_n)
        if not results:
            raise HTTPException(status_code=404, detail="Movie not found")
        return {"movie_id": movie_id, "recommendations": results}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
def get_user_recommendations(user_id: str, top_n: int = Query(10, le=20)):
    try:
        collaborative_engine.train()
        results = collaborative_engine.get_recommendations(user_id, top_n)
        return {"user_id": user_id, "recommendations": results, "type": "collaborative"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hybrid")
def get_hybrid_recommendations(
    user_id: str = Query(None),
    movie_id: int = Query(None),
    mood: str = Query(None),
    top_n: int = Query(10, le=20)
):
    try:
        results = hybrid_engine.get_hybrid_recommendations(
            user_id=user_id,
            movie_id=movie_id,
            mood=mood,
            top_n=top_n
        )
        return {"recommendations": results, "type": "hybrid"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mood/{mood}")
def get_mood_recommendations(mood: str, top_n: int = Query(10, le=20)):
    try:
        results = hybrid_engine.get_hybrid_recommendations(mood=mood, top_n=top_n)
        return {"mood": mood, "recommendations": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/startup")
def startup_engine():
    try:
        content_engine.train()
        collaborative_engine.train()
        return {"status": "ok", "movies_loaded": len(content_engine.movies)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))