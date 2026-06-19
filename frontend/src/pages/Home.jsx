import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MovieCard from '../components/ui/MovieCard'
import MovieModal from '../components/ui/MovieModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getMovies } from '../api/movies'

function Home() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [modalMovie, setModalMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies(1)
        setMovies(data.slice(0, 12))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>

      {/* Hero */}
      <div className="hero-glow relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-indigo-300">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              AI-Powered Recommendations
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <br />
              <span className="text-gradient">Favorite Movie</span>
            </h1>

            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
              A hybrid AI engine combining content analysis and collaborative filtering
              to find movies you'll love.
            </p>

            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/recommendations')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-indigo-500/25"
              >
                Get Recommendations
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="glass glass-hover text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg"
              >
                Browse Movies
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Movies', value: '4,800+' },
            { label: 'ML Algorithm', value: 'Hybrid AI' },
            { label: 'Recommendation Types', value: '3' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">🔥 Trending Now</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading movies..." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
          )}
        </div>
      </div>

      {modalMovie && (
        <MovieModal movie={modalMovie} onClose={() => setModalMovie(null)} />
      )}
    </div>
  )
}

export default Home