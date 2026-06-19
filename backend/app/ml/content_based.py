import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.core.database import supabase

class ContentBasedEngine:
    def __init__(self):
        self.movies = []
        self.tfidf_matrix = None
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.is_trained = False

    def fetch_movies(self):
        print("Fetching movies from Supabase...")
        all_movies = []
        batch_size = 1000
        offset = 0

        while True:
            result = supabase.table("movies").select(
                "id, title, genre, plot, year, imdb_rating"
            ).range(offset, offset + batch_size - 1).execute()

            if not result.data:
                break

            all_movies.extend(result.data)
            offset += batch_size

            if len(result.data) < batch_size:
                break

        self.movies = all_movies
        print(f"Fetched {len(self.movies)} movies")

    def build_features(self, movie):
        genre = movie.get('genre') or ''
        plot = movie.get('plot') or ''
        title = movie.get('title') or ''
        return f"{title} {genre} {genre} {plot}"

    def train(self):
        self.fetch_movies()
        if not self.movies:
            print("No movies found!")
            return

        print("Building TF-IDF matrix...")
        features = [self.build_features(m) for m in self.movies]
        self.tfidf_matrix = self.vectorizer.fit_transform(features)
        self.is_trained = True
        print("Content-based engine ready!")

    def get_similar_movies(self, movie_id: int, top_n: int = 10):
        if not self.is_trained:
            self.train()

        movie_ids = [m['id'] for m in self.movies]

        if movie_id not in movie_ids:
            return []

        idx = movie_ids.index(movie_id)
        movie_vector = self.tfidf_matrix[idx]
        similarity_scores = cosine_similarity(movie_vector, self.tfidf_matrix).flatten()
        similar_indices = similarity_scores.argsort()[::-1][1:top_n+1]

        results = []
        source_movie = self.movies[idx]

        for i in similar_indices:
            movie = self.movies[i]
            score = float(similarity_scores[i])

            reason = self._explain(source_movie, movie)

            results.append({
                **movie,
                'confidence_score': round(score, 3),
                'reason': reason
            })

        return results

    def _explain(self, source, target):
        source_genres = set((source.get('genre') or '').split(', '))
        target_genres = set((target.get('genre') or '').split(', '))
        common_genres = source_genres & target_genres

        if common_genres:
            genres_str = ', '.join(list(common_genres)[:2])
            return f"Similar {genres_str} themes to {source['title']}"
        return f"Similar story and style to {source['title']}"

# Global instance
content_engine = ContentBasedEngine()