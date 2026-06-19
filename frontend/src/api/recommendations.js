const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getSimilarMovies = async (movieId, topN = 10) => {
  const res = await fetch(`${BASE_URL}/api/v1/recommendations/similar/${movieId}?top_n=${topN}`)
  const data = await res.json()
  return data.recommendations
}

export const getHybridRecommendations = async ({ userId, movieId, mood, topN = 10 }) => {
  const params = new URLSearchParams()
  if (userId) params.append('user_id', userId)
  if (movieId) params.append('movie_id', movieId)
  if (mood) params.append('mood', mood)
  params.append('top_n', topN)
  const res = await fetch(`${BASE_URL}/api/v1/recommendations/hybrid?${params}`)
  const data = await res.json()
  return data.recommendations
}

export const getMoodRecommendations = async (mood, topN = 10) => {
  const res = await fetch(`${BASE_URL}/api/v1/recommendations/mood/${mood}?top_n=${topN}`)
  const data = await res.json()
  return data.recommendations
}

export const startupEngine = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/recommendations/startup`)
  return await res.json()
}