import axios from 'axios'

// 🌍 Base URL dynamique (selon environnement)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backendmcn-production.up.railway.app/api'

// 🧱 Création d'une instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔐 important pour CSRF + cookies
})

// 🧩 Récupération du CSRF token depuis le backend
async function ensureCSRFToken() {
  try {
    await api.get('/csrf/')
    console.log("c'est bon")
  } catch (error) {
    console.error('Erreur lors de la récupération du CSRF token:', error)
  }
}

// 🚦 Intercepteur des requêtes
api.interceptors.request.use(
  async (config) => {
    // 🔤 Ajoute la langue si elle existe
    const language = localStorage.getItem('language')
    if (language) {
      config.headers['Accept-Language'] = language
    }

    // 🔐 Vérifie la présence du CSRF token avant les requêtes POST/PUT/DELETE
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      const csrfToken = getCSRFCookie('csrftoken')
      if (!csrfToken) {
        await ensureCSRFToken()
      }
      config.headers['X-CSRFToken'] = getCSRFCookie('csrftoken')
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 🚨 Intercepteur des réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response?.status === 404) {
      throw new Error('⛔ Ressource non trouvée')
    } else if (error.response?.status === 500) {
      throw new Error('💥 Erreur serveur')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('⏳ Délai d’attente dépassé')
    } else if (error.response?.status === 403) {
      console.warn('🚫 Accès refusé — peut-être un problème CSRF')
    }

    throw error
  }
)

// 🍪 Fonction pour lire un cookie CSRF
function getCSRFCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
  return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null
}

// =========================
// 🏛️ API du musée
// =========================
export const museumApi = {
  // --- Artifacts ---
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

  // --- Collections ---
  async getCollections() {
    const response = await api.get('/collections/')
    return response.data
  },

  async getCollection(id) {
    const response = await api.get(`/collections/${id}/`)
    return response.data
  },

  // --- Periods & Cultures ---
  async getPeriods() {
    const response = await api.get('/periods/')
    return response.data
  },

  async getCultures() {
    const response = await api.get('/cultures/')
    return response.data
  },

  // --- Médias ---
  async getAudioGuides(artifactId) {
    const response = await api.get('/audio-guides/', {
      params: { artifact: artifactId },
    })
    return response.data
  },

  async getVideos(artifactId) {
    const response = await api.get('/videos/', {
      params: { artifact: artifactId },
    })
    return response.data
  },

  // --- QR Scanner ---
  async scanQRCode(qrData) {
    const response = await api.post('/qr-scan/', { qr_data: qrData })
    return response.data
  },

  // --- Suivi des visites ---
  async trackVisit(artifactId, sessionId, duration = 0) {
    if (import.meta.env.MODE === 'production') {
      const response = await api.post(`/artifacts/${artifactId}/track_visit/`, {
        session_id: sessionId,
        duration_seconds: duration,
      })
      return response.data
    }
    return null
  },

  // --- Statistiques ---
  async getStats() {
    const response = await api.get('/stats/dashboard/')
    return response.data
  },
}

export default api
