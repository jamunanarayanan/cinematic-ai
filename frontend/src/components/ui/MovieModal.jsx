import { motion, AnimatePresence } from 'framer-motion'
import StarRating from './StarRating'
import useAuthStore from '../../store/authStore'
import { addRating } from '../../api/ratings'
import { useState } from 'react'

function MovieModal({ movie, onClose }) {
  const { user } = useAuthStore()
  const [rated, setRated] = useState(false)
  const [message, setMessage] = useState(null)

  if (!movie) return null

  const handleRate = async (rating) => {
    if (!user) {
      setMessage('Please login to rate movies')
      return
    }
    try {
      await addRating(user.id, movie.id, rating)
      setRated(true)
      setMessage(`You rated this ${rating}/5 ⭐`)
    } catch (err) {
      setMessage('Failed to save rating')
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                {movie.year && (
                  <span className="text-gray-400 text-sm">{movie.year}</span>
                )}
                {movie.genre && (
                  <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full">
                    {movie.genre}
                  </span>
                )}
                {movie.imdb_rating && (
                  <span className="text-yellow-400 text-sm">
                    ⭐ {movie.imdb_rating}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Plot */}
          {movie.plot && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {movie.plot}
            </p>
          )}

          {/* Rating */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-sm mb-3">Rate this movie:</p>
            <StarRating onRate={handleRate} />
            {message && (
              <p className="text-indigo-400 text-sm mt-2">{message}</p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MovieModal