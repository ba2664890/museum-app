import axios from 'axios'

// --- CSRF helper ---
function getCookie(name) {
  let cookieValue = null
  if (document.cookie) {
    document.cookie.split(';').forEach(c => {
      const [k, v] = c.trim().split('=')
      if (k === name) cookieValue = decodeURIComponent(v)
    })
  }
  return cookieValue
}

const csrftoken = getCookie('csrftoken')

// --- Axios instance ---
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ envoie les cookies (sessions / CSRF)
})

// --- Request interceptor ---
api.interceptors.request.use(
  (config) => {
    const csrfSafeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE']
    if (!csrfSafeMethods.includes(config.method?.toUpperCase())) {
      config.headers['X-CSRFToken'] = csrftoken
    }

    const language = localStorage.getItem('language')
    if (language) {
      config.headers['Accept-Language'] = language
    }

    return config
  },
  (error) => Promise.reject(error)
)

// --- Response interceptor ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response?.status === 401) {
      throw new Error('Non autorisé – veuillez vous connecter')
    } else if (error.response?.status === 403) {
      throw new Error('Accès refusé ou CSRF invalide')
    } else if (error.response?.status === 404) {
      throw new Error('Ressource non trouvée')
    } else if (error.response?.status === 500) {
      throw new Error('Erreur serveur')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout de la requête')
    }

    throw error
  }
)

// --- API methods ---
export const museumApi = {
  // Auth
  login: async (username, password) => {
    const response = await api.post('/api-auth/login/', { username, password })
    return response.data
  },
  logout: async () => {
    const response = await api.post('/api-auth/logout/')
    return response.data
  },

  // Artifacts
  getArtifacts: async (params = {}) => {
    const response = await api.get('/artifacts/', { params })
    return response.data
  },
  getArtifact: async (id) => {
    const response = await api.get(`/artifacts/${id}/`)
    return response.data
  },
  getFeaturedArtifacts: async () => {
    const response = await api.get('/artifacts/featured/')
    return response.data
  },
  searchArtifacts: async (query, filters = {}) => {
    const params = { q: query, ...filters }
    const response = await api.get('/artifacts/search/', { params })
    return response.data
  },

  // Collections
  getCollections: async () => {
    const response = await api.get('/collections/')
    return response.data
  },
  getCollection: async (id) => {
    const response = await api.get(`/collections/${id}/`)
    return response.data
  },

  // Periods and Cultures
  getPeriods: async () => {
    const response = await api.get('/periods/')
    return response.data
  },
  getCultures: async () => {
    const response = await api.get('/cultures/')
    return response.data
  },

  // Media
  getAudioGuides: async (artifactId) => {
    const response = await api.get('/audio-guides/', { params: { artifact: artifactId } })
    return response.data
  },
  getVideos: async (artifactId) => {
    const response = await api.get('/videos/', { params: { artifact: artifactId } })
    return response.data
  },

  // QR Scanner
  scanQRCode: async (qrData) => {
    const response = await api.post('/qr-scan/', { qr_data: qrData })
    return response.data
  },

  // Visit tracking
  trackVisit: async (artifactId, sessionId, duration = 0) => {
    if (process.env.NODE_ENV === 'production') {
      const response = await api.post(`/artifacts/${artifactId}/track_visit/`, {
        session_id: sessionId,
        duration_seconds: duration,
      })
      return response.data
    }
    return null
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/stats/dashboard/')
    return response.data
  },
}

export default api
