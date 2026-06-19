import pandas as pd
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import supabase

def extract_genres(genre_str):
    try:
        genres = json.loads(genre_str)
        return ', '.join([g['name'] for g in genres[:3]])
    except:
        return ''

def extract_names(json_str, key='name', limit=3):
    try:
        items = json.loads(json_str)
        return ', '.join([item[key] for item in items[:limit]])
    except:
        return ''

def load_movies():
    print("Loading dataset...")
    df = pd.read_csv('data/tmdb_5000_movies.csv')

    print(f"Total movies found: {len(df)}")

    movies = []
    for _, row in df.iterrows():
        title = str(row.get('title', '')).strip()
        if not title:
            continue

        movie = {
            'title': title,
            'year': int(str(row.get('release_date', '0'))[:4]) if pd.notna(row.get('release_date')) else None,
            'genre': extract_genres(row.get('genres', '[]')),
            'plot': str(row.get('overview', ''))[:500] if pd.notna(row.get('overview')) else '',
            'imdb_rating': float(row.get('vote_average', 0)) if pd.notna(row.get('vote_average')) else None,
            'imdb_id': str(row.get('imdb_id', '')) if pd.notna(row.get('imdb_id')) else None,
            'movie_cast': extract_names(row.get('keywords', '[]')),
            'director': '',
            'poster_url': '',
        }
        movies.append(movie)

    print(f"Inserting {len(movies)} movies into Supabase...")

    batch_size = 100
    for i in range(0, len(movies), batch_size):
        batch = movies[i:i+batch_size]
        try:
            supabase.table('movies').insert(batch).execute()
            print(f"Inserted batch {i//batch_size + 1}/{(len(movies)//batch_size) + 1}")
        except Exception as e:
            print(f"Error on batch {i//batch_size + 1}: {e}")

    print("Done! Movies loaded successfully.")

if __name__ == '__main__':
    load_movies()