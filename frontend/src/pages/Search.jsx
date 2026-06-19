import { useState } from 'react'
import { motion } from 'framer-motion'
import MovieCard from '../components/ui/MovieCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MovieModal from '../components/ui/MovieModal'
import { searchMovies } from '../api/movies'

function Search() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [modalMovie, setModalMovie] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const results = await searchMovies(query)
      setMovies(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Search Movies</h1>
        <p className="text-gray-400">Find any movie from our database of 4800+ titles</p>
      </motion.div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Search
        </button>
      </form>

      {loading && <LoadingSpinner text="Searching movies..." />}

      {!loading && searched && movies.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No movies found for "{query}"
        </div>
      )}

      {!loading && movies.length > 0 && (
        <>
          <p className="text-gray-400 text-sm mb-6">{movies.length} results for "{query}"</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setModalMovie(movie)}
              >
                <MovieCard
                  title={movie.title}
                  year={movie.year}
                  genre={movie.genre}
                  rating={movie.imdb_rating}
                  poster={movie.poster_url}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {modalMovie && (
        <MovieModal movie={modalMovie} onClose={() => setModalMovie(null)} />
      )}
    </div>
  )
}

export default Search