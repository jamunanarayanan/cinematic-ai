import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../store/authStore'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/recommendations', label: 'For You' },
  { path: '/watchlist', label: 'Watchlist' },
  { path: '/analytics', label: 'Analytics' },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/5"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-bold text-gradient">CinematicAI</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
            >
              {location.pathname === link.path ? (
                <>
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
                  />
                  <span className="relative text-indigo-400">{link.label}</span>
                </>
              ) : (
                <span className="text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg glass glass-hover transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar