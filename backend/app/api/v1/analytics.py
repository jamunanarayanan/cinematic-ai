from fastapi import APIRouter, HTTPException
from collections import Counter
from app.core.database import supabase

router = APIRouter()

@router.get("/user/{user_id}")
def get_user_analytics(user_id: str):
    try:
        # Fetch user's ratings with movie details
        ratings_result = supabase.table("ratings").select(
            "rating, created_at, movies(id, title, genre, year)"
        ).eq("user_id", user_id).execute()

        ratings_data = ratings_result.data

        if not ratings_data:
            return {
                "total_ratings": 0,
                "average_rating": 0,
                "genre_breakdown": [],
                "rating_distribution": [],
                "recent_activity": []
            }

        # Total + average rating
        total_ratings = len(ratings_data)
        avg_rating = round(sum(r['rating'] for r in ratings_data) / total_ratings, 2)

        # Genre breakdown
        genre_counter = Counter()
        for r in ratings_data:
            movie = r.get('movies')
            if movie and movie.get('genre'):
                genres = [g.strip() for g in movie['genre'].split(',')]
                for g in genres:
                    if g:
                        genre_counter[g] += 1

        genre_breakdown = [
            {"genre": g, "count": c}
            for g, c in genre_counter.most_common(6)
        ]

        # Rating distribution (1-5 stars)
        rating_dist = Counter()
        for r in ratings_data:
            rating_dist[int(r['rating'])] += 1

        rating_distribution = [
            {"stars": i, "count": rating_dist.get(i, 0)}
            for i in range(1, 6)
        ]

        # Recent activity (last 5 ratings)
        sorted_ratings = sorted(
            ratings_data, key=lambda x: x['created_at'], reverse=True
        )[:5]
        recent_activity = [
            {
                "title": r['movies']['title'] if r.get('movies') else 'Unknown',
                "rating": r['rating'],
                "date": r['created_at']
            }
            for r in sorted_ratings
        ]

        return {
            "total_ratings": total_ratings,
            "average_rating": avg_rating,
            "genre_breakdown": genre_breakdown,
            "rating_distribution": rating_distribution,
            "recent_activity": recent_activity
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/platform")
def get_platform_analytics():
    try:
        movies_result = supabase.table("movies").select("id", count="exact").execute()
        ratings_result = supabase.table("ratings").select("id", count="exact").execute()
        users_result = supabase.table("profiles").select("id", count="exact").execute()

        top_rated = supabase.table("movies").select(
            "title, imdb_rating"
        ).not_.is_("imdb_rating", "null").order("imdb_rating", desc=True).limit(5).execute()

        return {
            "total_movies": movies_result.count or 0,
            "total_ratings": ratings_result.count or 0,
            "total_users": users_result.count or 0,
            "top_rated_movies": top_rated.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))