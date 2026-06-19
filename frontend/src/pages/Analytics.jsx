import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getUserAnalytics } from '../api/analytics'
import useAuthStore from '../store/authStore'

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

function Analytics() {
  const { user } = useAuthStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserAnalytics(user.id)
        setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <LoadingSpinner text="Loading your analytics..." />
      </div>
    )
  }

  if (!data || data.total_ratings === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">No data yet</h1>
        <p className="text-gray-400">
          Rate some movies to see your personalized analytics dashboard!
        </p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-3 py-2 text-sm text-white">
          {payload[0].name}: {payload[0].value}
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Your Analytics</h1>
        <p className="text-gray-400">Insights into your movie taste and activity</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass rounded-2xl p-6">
          <div className="text-3xl font-bold text-gradient mb-1">{data.total_ratings}</div>
          <div className="text-gray-400 text-sm">Movies Rated</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-3xl font-bold text-gradient mb-1">{data.average_rating}</div>
          <div className="text-gray-400 text-sm">Average Rating</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-3xl font-bold text-gradient mb-1">
            {data.genre_breakdown[0]?.genre || '—'}
          </div>
          <div className="text-gray-400 text-sm">Top Genre</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-3xl font-bold text-gradient mb-1">
            {data.genre_breakdown.length}
          </div>
          <div className="text-gray-400 text-sm">Genres Explored</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Genre Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Favorite Genres</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.genre_breakdown}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ genre }) => genre}
              >
                {data.genre_breakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rating Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.rating_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="stars" stroke="#6b7280" tickFormatter={(v) => `${v}★`} />
              <YAxis stroke="#6b7280" allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.recent_activity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <span className="text-gray-300">{activity.title}</span>
              <span className="text-yellow-400 text-sm">
                {'★'.repeat(Math.round(activity.rating))} {activity.rating}/5
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics