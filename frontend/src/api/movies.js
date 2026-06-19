const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const searchMovies = async (query) => {
  const res = await fetch(`${BASE_URL}/api/v1/movies/?search=${query}&limit=20`)
  const data = await res.json()
  return data.movies
}

export const getMovies = async (page = 1, genre = null) => {
  let url = `${BASE_URL}/api/v1/movies/?page=${page}&limit=20`
  if (genre) url += `&genre=${genre}`
  const res = await fetch(url)
  const data = await res.json()
  return data.movies
}

export const getMovie = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/movies/${id}`)
  return await res.json()
}