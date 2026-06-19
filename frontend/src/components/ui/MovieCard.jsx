import { motion } from 'framer-motion'

function MovieCard({ title, year, genre, rating, poster, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-indigo-500 transition-all duration-300 group"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-gray-800 relative overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-800 to-gray-900">
            🎬
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg">
            ⭐ {rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {year && <span className="text-gray-500 text-xs">{year}</span>}
          {genre && (
            <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full truncate">
              {genre.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MovieCard