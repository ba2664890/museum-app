import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add language header if available
    const language = localStorage.getItem('language')
    if (language) {
      config.headers['Accept-Language'] = language
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    
    // Handle different error types
    if (error.response?.status === 404) {
      throw new Error('Resource not found')
    } else if (error.response?.status === 500) {
      throw new Error('Server error')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout')
    }
    
    throw error
  }
)

export const museumApi = {
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
    const response = await api.get('/audio-guides/', { 
      params: { artifact: artifactId } 
    })
    return response.data
  },

  async getVideos(artifactId) {
    const response = await api.get('/videos/', { 
      params: { artifact: artifactId } 
    })
    return response.data
  },

  // QR Scanner
  async scanQRCode(qrData) {
    const response = await api.post('/qr-scan/', { qr_data: qrData })
    return response.data
  },

  // Visit tracking
  async trackVisit(artifactId, sessionId, duration = 0) {
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
  async getStats() {
    const response = await api.get('/stats/dashboard/')
    return response.data
  },
}

export default api