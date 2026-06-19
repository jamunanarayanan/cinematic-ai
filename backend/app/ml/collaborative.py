import numpy as np
from app.core.database import supabase

class CollaborativeEngine:
    def __init__(self):
        self.ratings_matrix = {}
        self.user_similarities = {}
        self.is_trained = False

    def fetch_ratings(self):
        print("Fetching ratings...")
        result = supabase.table("ratings").select("user_id, movie_id, rating").execute()
        return result.data

    def build_matrix(self, ratings):
        matrix = {}
        for r in ratings:
            uid = r['user_id']
            mid = r['movie_id']
            rating = r['rating']
            if uid not in matrix:
                matrix[uid] = {}
            matrix[uid][mid] = rating
        return matrix

    def cosine_similarity(self, user1_ratings, user2_ratings):
        common = set(user1_ratings.keys()) & set(user2_ratings.keys())
        if not common:
            return 0.0

        v1 = np.array([user1_ratings[m] for m in common])
        v2 = np.array([user2_ratings[m] for m in common])

        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return float(np.dot(v1, v2) / (norm1 * norm2))

    def train(self):
        ratings = self.fetch_ratings()
        if not ratings:
            print("No ratings yet")
            self.is_trained = True
            return

        self.ratings_matrix = self.build_matrix(ratings)
        print(f"Built matrix for {len(self.ratings_matrix)} users")
        self.is_trained = True

    def get_recommendations(self, user_id: str, top_n: int = 10):
        if not self.is_trained:
            self.train()

        if user_id not in self.ratings_matrix:
            return []

        user_ratings = self.ratings_matrix[user_id]
        user_movies = set(user_ratings.keys())

        similar_users = []
        for other_id, other_ratings in self.ratings_matrix.items():
            if other_id == user_id:
                continue
            sim = self.cosine_similarity(user_ratings, other_ratings)
            if sim > 0:
                similar_users.append((other_id, sim))

        similar_users.sort(key=lambda x: x[1], reverse=True)
        top_users = similar_users[:10]

        movie_scores = {}
        for other_id, sim in top_users:
            for movie_id, rating in self.ratings_matrix[other_id].items():
                if movie_id not in user_movies:
                    if movie_id not in movie_scores:
                        movie_scores[movie_id] = []
                    movie_scores[movie_id].append(rating * sim)

        if not movie_scores:
            return []

        ranked = sorted(
            movie_scores.items(),
            key=lambda x: sum(x[1]) / len(x[1]),
            reverse=True
        )[:top_n]

        movie_ids = [m[0] for m in ranked]
        result = supabase.table("movies").select(
            "id, title, year, genre, imdb_rating"
        ).in_("id", movie_ids).execute()

        movies = {m['id']: m for m in result.data}

        recommendations = []
        for movie_id, scores in ranked:
            if movie_id in movies:
                movie = movies[movie_id]
                confidence = round(sum(scores) / len(scores) / 5, 3)
                recommendations.append({
                    **movie,
                    'confidence_score': confidence,
                    'reason': 'Users with similar taste enjoyed this movie'
                })

        return recommendations

# Global instance
collaborative_engine = CollaborativeEngine()