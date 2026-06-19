import { useState } from 'react'

function StarRating({ onRate, initialRating = 0 }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(initialRating)

  const handleRate = (rating) => {
    setSelected(rating)
    if (onRate) onRate(rating)
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={
            star <= (hovered || selected)
              ? 'text-yellow-400'
              : 'text-gray-600'
          }>
            ★
          </span>
        </button>
      ))}
      {selected > 0 && (
        <span className="text-gray-400 text-sm ml-2">
          {selected}/5
        </span>
      )}
    </div>
  )
}

export default StarRating