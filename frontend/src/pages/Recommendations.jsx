import { useState } from 'react'
import { motion } from 'framer-motion'
import MovieCard from '../components/ui/MovieCard'
import MovieModal from '../components/ui/MovieModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { searchMovies } from '../api/movies'
import { getMoodRecommendations, getHybridRecommendations } from '../api/recommendations'
import useAuthStore from '../store/authStore'

const MOODS = [
  { key: 'happy', label: '😊 Happy', color: 'bg-yellow-900/40 border-yellow-700 text-yellow-300' },
  { key: 'mind-bending', label: '🌀 Mind-bending', color: 'bg-purple-900/40 border-purple-700 text-purple-300' },
  { key: 'motivational', label: '💪 Motivational', color: 'bg-green-900/40 border-green-700 text-green-300' },
  { key: 'romantic', label: '❤️ Romantic', color: 'bg-pink-900/40 border-pink-700 text-pink-300' },
  { key: 'action', label: '💥 Action', color: 'bg-red-900/40 border-red-700 text-red-300' },
  { key: 'scary', label: '👻 Scary', color: 'bg-gray-800/40 border-gray-600 text-gray-300' },
]

function Recommendations() {
  const { user } = useAuthStore()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [modalMovie, setModalMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recLoading, setRecLoading] = useState(false)
  const [recType, setRecType] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const results = await searchMovies(query)
      setSearchResults(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie)
    setSelectedMood(null)
    setSearchResults([])
    setQuery('')
    setRecLoading(true)
    setRecType('content')
    try {
      const recs = await getHybridRecommendations({
        userId: user?.id,
        movieId: movie.id,
      })
      setRecommendations(recs)
    } catch (err) {
      console.error(err)
    } finally {
      setRecLoading(false)
    }
  }

  const handleMood = async (mood) => {
    setSelectedMood(mood)
    setSelectedMovie(null)
    setSearchResults([])
    setRecLoading(true)
    setRecType('mood')
    try {
      const recs = await getMoodRecommendations(mood)
      setRecommendations(recs)
    } catch (err) {
      console.error(err)
    } finally {
      setRecLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-2">AI Recommendations</h1>
        <p className="text-gray-400">Search a movie or pick a mood to get started</p>
      </motion.div>

      {/* Mood Selector */}
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-3">🎭 What's your mood?</p>
        <div className="flex flex-wrap gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.key}
              onClick={() => handleMood(mood.key)}
              className={`border px-4 py-2 rounded-xl text-sm font-medium transition-all ${mood.color} ${
                selectedMood === mood.key ? 'ring-2 ring-white/30 scale-105' : 'hover:scale-105'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Or search a movie you like..."
          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Search
        </button>
      </form>

      {/* Search Results */}
      {loading && <LoadingSpinner text="Searching..." />}
      {searchResults.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-8">
          <p className="text-gray-400 text-sm mb-3">Select a movie to get recommendations:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {searchResults.slice(0, 10).map((movie) => (
              <div key={movie.id} onClick={() => handleSelectMovie(movie)}>
                <MovieCard
                  title={movie.title}
                  year={movie.year}
                  genre={movie.genre}
                  rating={movie.imdb_rating}
                  poster={movie.poster_url}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected context */}
      {(selectedMovie || selectedMood) && (
        <div className="mb-8 p-4 bg-indigo-900/30 border border-indigo-700 rounded-xl">
          {selectedMovie && (
            <>
              <p className="text-indigo-300 text-sm">Hybrid AI recommendations based on:</p>
              <p className="text-white font-bold text-lg">{selectedMovie.title} ({selectedMovie.year})</p>
            </>
          )}
          {selectedMood && (
            <>
              <p className="text-indigo-300 text-sm">Mood-based recommendations for:</p>
              <p className="text-white font-bold text-lg">
                {MOODS.find(m => m.key === selectedMood)?.label}
              </p>
            </>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recLoading && <LoadingSpinner text="AI is finding movies..." />}
      {!recLoading && recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {recType === 'mood' ? '🎭 Mood Picks' : '🎯 AI Recommendations'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div onClick={() => setModalMovie(movie)}>
                  <MovieCard
                    title={movie.title}
                    year={movie.year}
                    genre={movie.genre}
                    rating={movie.imdb_rating}
                    poster={movie.poster_url}
                  />
                </div>
                <div className="mt-2 px-1">
                  <span className="text-xs text-indigo-400 font-medium">
                    {Math.round((movie.confidence_score || 0) * 100)}% match
                  </span>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {movie.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {modalMovie && (
        <MovieModal movie={modalMovie} onClose={() => setModalMovie(null)} />
      )}
    </div>
  )
}

export default Recommendations