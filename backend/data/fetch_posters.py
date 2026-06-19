import requests
import time
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import supabase
from app.core.config import settings

TMDB_BASE = "https://api.themoviedb.org/3"
POSTER_BASE = "https://image.tmdb.org/t/p/w500"

def fetch_poster(imdb_id=None, title=None, year=None):
    try:
        if imdb_id:
            url = f"{TMDB_BASE}/find/{imdb_id}?api_key={settings.tmdb_api_key}&external_source=imdb_id"
            res = requests.get(url, timeout=5)
            data = res.json()
            results = data.get('movie_results', [])
            if results and results[0].get('poster_path'):
                return POSTER_BASE + results[0]['poster_path']

        if title:
            query = title.replace(' ', '+')
            url = f"{TMDB_BASE}/search/movie?api_key={settings.tmdb_api_key}&query={query}&year={year or ''}"
            res = requests.get(url, timeout=5)
            data = res.json()
            results = data.get('results', [])
            if results and results[0].get('poster_path'):
                return POSTER_BASE + results[0]['poster_path']

    except Exception as e:
        print(f"Error fetching poster: {e}")
    return None

def update_posters():
    print("Fetching movies without posters...")
    result = supabase.table("movies").select(
        "id, title, year, imdb_id, poster_url"
    ).eq("poster_url", "").limit(500).execute()

    movies = result.data
    print(f"Found {len(movies)} movies without posters")

    updated = 0
    for i, movie in enumerate(movies):
        poster_url = fetch_poster(
            imdb_id=movie.get('imdb_id'),
            title=movie.get('title'),
            year=movie.get('year')
        )

        if poster_url:
            supabase.table("movies").update(
                {"poster_url": poster_url}
            ).eq("id", movie['id']).execute()
            updated += 1
            print(f"[{i+1}/{len(movies)}] ✅ {movie['title']}")
        else:
            print(f"[{i+1}/{len(movies)}] ❌ {movie['title']} — no poster found")

        time.sleep(0.25)

    print(f"\nDone! Updated {updated}/{len(movies)} movies with posters")

if __name__ == '__main__':
    update_posters()