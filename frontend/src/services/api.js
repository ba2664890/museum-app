// src/services/api.js
import axios from 'axios'

// Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://museum-api-production.up.railway.app/api'

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour cookies CSRF cross-site
})

// --- CSRF Token Management ---
let csrfToken = null

export const fetchCsrfToken = async () => {
  try {
    const res = await api.get('/csrf/')
    csrfToken = res.data.csrfToken
    return csrfToken
  } catch (err) {
    console.error('Failed to fetch CSRF token', err)
    throw err
  }
}

// Request interceptor to attach CSRF token for unsafe methods
api.interceptors.request.use(
  (config) => {
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers['X-CSRFToken'] = csrfToken
    }

    // Add Accept-Language header
    const language = localStorage.getItem('language')
    if (language) {
      config.headers['Accept-Language'] = language
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response?.status === 404) throw new Error('Resource not found')
    if (error.response?.status === 500) throw new Error('Server error')
    if (error.code === 'ECONNABORTED') throw new Error('Request timeout')

    throw error
  }
)

// --- API Methods ---
export const museumApi = {
  // --- Artifacts ---
  async getArtifacts(params = {}) {
    const res = await api.get('/artifacts/', { params })
    return res.data
  },

  async getArtifact(id) {
    const res = await api.get(`/artifacts/${id}/`)
    return res.data
  },

  async getFeaturedArtifacts() {
    const res = await api.get('/artifacts/featured/')
    return res.data
  },

  async searchArtifacts(query, filters = {}) {
    const params = { q: query, ...filters }
    const res = await api.get('/artifacts/search/', { params })
    return res.data
  },

  async trackVisit(artifactId, sessionId, duration = 0) {
    await fetchCsrfToken() // Ensure CSRF token
    const res = await api.post(`/artifacts/${artifactId}/track_visit/`, {
      session_id: sessionId,
      duration_seconds: duration,
    })
    return res.data
  },

  // --- Collections ---
  async getCollections() {
    const res = await api.get('/collections/')
    return res.data
  },

  async getCollection(id) {
    const res = await api.get(`/collections/${id}/`)
    return res.data
  },

  // --- Periods & Cultures ---
  async getPeriods() {
    const res = await api.get('/periods/')
    return res.data
  },

  async getCultures() {
    const res = await api.get('/cultures/')
    return res.data
  },

  // --- Media ---
  async getAudioGuides(artifactId) {
    const res = await api.get('/audio-guides/', { params: { artifact: artifactId } })
    return res.data
  },

  async getVideos(artifactId) {
    const res = await api.get('/videos/', { params: { artifact: artifactId } })
    return res.data
  },

  // --- QR Scanner ---
  async scanQRCode(qrData) {
    await fetchCsrfToken()
    const res = await api.post('/qr-scan/', { qr_data: qrData })
    return res.data
  },

  // --- Statistics ---
  async getStats() {
    const res = await api.get('/stats/dashboard/')
    return res.data
  },
}

export default api
