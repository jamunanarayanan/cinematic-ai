function Button({ children, variant = 'primary', onClick, disabled, className = '' }) {
  const base = 'px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50'
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'border border-gray-700 hover:border-gray-500 text-gray-300',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button