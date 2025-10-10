import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backendmcn-production.up.railway.app/api'

// Créer une instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour envoyer les cookies CSRF
})

// Stocker le CSRF token
let csrfToken = null

// Fonction pour récupérer le CSRF token depuis Django
export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/csrf/`, { withCredentials: true })
    csrfToken = response.data.csrfToken
    return csrfToken
  } catch (error) {
    console.error('Failed to fetch CSRF token', error)
    throw error
  }
}

// Intercepteur pour ajouter le CSRF token aux requêtes
api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  const language = localStorage.getItem('language')
  if (language) {
    config.headers['Accept-Language'] = language
  }
  return config
}, (error) => Promise.reject(error))

// Intercepteur de réponse pour gérer erreurs
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

export const museumApi = {
  // CSRF
  fetchCsrfToken,

  // Artifacts
  async getArtifacts(params = {}) {
    const response = await api.get('/artifacts/', { params })
    return response.data
  },

  async getArtifact(id) {
    const response = await api.get(`/artifacts/${id}/`)
    return response.data
  },

  async getFeaturedArtifacts() {
    const response = await api.get('/artifacts/featured/')
    return response.data
  },

  async searchArtifacts(query, filters = {}) {
    const params = { q: query, ...filters }
    const response = await api.get('/artifacts/search/', { params })
    return response.data
  },

  // Collections
  async getCollections() {
    const response = await api.get('/collections/')
    return response.data
  },

  async getCollection(id) {
    const response = await api.get(`/collections/${id}/`)
    return response.data
  },

  // Periods and Cultures
  async getPeriods() {
    const response = await api.get('/periods/')
    return response.data
  },

  async getCultures() {
    const response = await api.get('/cultures/')
    return response.data
  },

  // Media
  async getAudioGuides(artifactId) {
    const response = await api.get('/audio-guides/', { params: { artifact: artifactId } })
    return response.data
  },

  async getVideos(artifactId) {
    const response = await api.get('/videos/', { params: { artifact: artifactId } })
    return response.data
  },

  // QR Scanner
  async scanQRCode(qrData) {
    const response = await api.post('/qr-scan/', { qr_data: qrData })
    return response.data
  },

  // Visit tracking
  async trackVisit(artifactId, sessionId, duration = 0) {
    const response = await api.post(`/artifacts/${artifactId}/track_visit/`, {
      session_id: sessionId,
      duration_seconds: duration,
    })
    return response.data
  },

  // Statistics
  async getStats() {
    const response = await api.get('/stats/dashboard/')
    return response.data
  },
}

export default api
