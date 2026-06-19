const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const addRating = async (userId, movieId, rating) => {
  const res = await fetch(`${BASE_URL}/api/v1/ratings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      movie_id: movieId,
      rating: rating,
    }),
  })
  return await res.json()
}

export const getUserRatings = async (userId) => {
  const res = await fetch(`${BASE_URL}/api/v1/ratings/user/${userId}`)
  const data = await res.json()
  return data.ratings
}

export const getMovieRatings = async (movieId) => {
  const res = await fetch(`${BASE_URL}/api/v1/ratings/movie/${movieId}`)
  return await res.json()
}