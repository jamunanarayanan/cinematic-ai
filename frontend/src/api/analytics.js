const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getUserAnalytics = async (userId) => {
  const res = await fetch(`${BASE_URL}/api/v1/analytics/user/${userId}`)
  return await res.json()
}

export const getPlatformAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/analytics/platform`)
  return await res.json()
}