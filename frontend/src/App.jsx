import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import Recommendations from './pages/Recommendations'
import Watchlist from './pages/Watchlist'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Register from './pages/Register'
import useAuthStore from './store/authStore'
import LoadingSpinner from './components/ui/LoadingSpinner'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <LoadingSpinner text="Checking auth..." />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  const { initialize, loading } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <LoadingSpinner text="Loading CinematicAI..." />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recommendations" element={
            <ProtectedRoute><Recommendations /></ProtectedRoute>
          } />
          <Route path="/watchlist" element={
            <ProtectedRoute><Watchlist /></ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute><Analytics /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App