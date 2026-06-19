from app.ml.content_based import content_engine
from app.ml.collaborative import collaborative_engine
from app.core.database import supabase

MOOD_GENRES = {
    "happy": ["Comedy", "Animation", "Family", "Romance"],
    "mind-bending": ["Science Fiction", "Mystery", "Thriller"],
    "motivational": ["Drama", "History", "War", "Biography"],
    "romantic": ["Romance", "Drama"],
    "action": ["Action", "Adventure", "Crime"],
    "scary": ["Horror", "Thriller", "Mystery"],
}

class HybridEngine:
    def __init__(self):
        self.content_weight = 0.6
        self.collab_weight = 0.4

    def get_popular_movies(self, top_n=10, genre_filter=None):
        query = supabase.table("movies").select(
            "id, title, year, genre, imdb_rating, plot"
        ).not_.is_("imdb_rating", "null").order("imdb_rating", desc=True)

        if genre_filter:
            query = query.ilike("genre", f"%{genre_filter}%")

        result = query.limit(top_n).execute()
        return [
            {
                **m,
                'confidence_score': round((m['imdb_rating'] or 0) / 10, 3),
                'reason': 'Highly rated and popular movie'
            }
            for m in result.data
        ]

    def get_hybrid_recommendations(
        self,
        user_id: str = None,
        movie_id: int = None,
        mood: str = None,
        top_n: int = 10
    ):
        # Ensure engines are trained
        if not content_engine.is_trained:
            content_engine.train()
        if not collaborative_engine.is_trained:
            collaborative_engine.train()

        content_recs = []
        collab_recs = []

        # Get content-based recs
        if movie_id:
            content_recs = content_engine.get_similar_movies(movie_id, top_n * 2)

        # Get collaborative recs
        if user_id:
            collab_recs = collaborative_engine.get_recommendations(user_id, top_n * 2)

        # Merge scores
        merged = {}

        for rec in content_recs:
            mid = rec['id']
            merged[mid] = {
                **rec,
                'score': rec['confidence_score'] * self.content_weight
            }

        for rec in collab_recs:
            mid = rec['id']
            if mid in merged:
                merged[mid]['score'] += rec['confidence_score'] * self.collab_weight
                merged[mid]['reason'] = 'Matches your taste and similar users'
            else:
                merged[mid] = {
                    **rec,
                    'score': rec['confidence_score'] * self.collab_weight
                }

        # Cold start — no recs yet
        if not merged:
            genre_filter = None
            if mood and mood.lower() in MOOD_GENRES:
                genre_filter = MOOD_GENRES[mood.lower()][0]
            return self.get_popular_movies(top_n, genre_filter)

        # Apply mood filter
        if mood and mood.lower() in MOOD_GENRES:
            mood_genres = [g.lower() for g in MOOD_GENRES[mood.lower()]]
            filtered = {
                mid: rec for mid, rec in merged.items()
                if any(g in (rec.get('genre') or '').lower() for g in mood_genres)
            }
            if filtered:
                merged = filtered

        # Sort by score
        ranked = sorted(merged.values(), key=lambda x: x['score'], reverse=True)[:top_n]

        return [
            {
                **r,
                'confidence_score': round(r['score'], 3)
            }
            for r in ranked
        ]

# Global instance
hybrid_engine = HybridEngine()