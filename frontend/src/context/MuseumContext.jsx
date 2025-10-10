import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { museumApi, fetchCsrfToken } from '../services/api'

const MuseumContext = createContext()

export const useMuseum = () => {
  const context = useContext(MuseumContext)
  if (!context) {
    throw new Error('useMuseum must be used within a MuseumProvider')
  }
  return context
}

export const MuseumProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [recentVisits, setRecentVisits] = useState([])
  const [sessionId] = useState(() => {
    let session = localStorage.getItem('museum_session_id')
    if (!session) {
      session = 'session_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('museum_session_id', session)
    }
    return session
  })
  const [csrfReady, setCsrfReady] = useState(false)

  // Récupérer CSRF token dès le montage
  useEffect(() => {
    fetchCsrfToken()
      .then(() => setCsrfReady(true))
      .catch(console.error)
  }, [])

  // Gestion des favoris
  useEffect(() => {
    const savedFavorites = localStorage.getItem('museum_favorites')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  useEffect(() => {
    localStorage.setItem('museum_favorites', JSON.stringify(favorites))
  }, [favorites])

  // Gestion des visites récentes
  useEffect(() => {
    const savedVisits = localStorage.getItem('museum_recent_visits')
    if (savedVisits) setRecentVisits(JSON.parse(savedVisits))
  }, [])

  useEffect(() => {
    localStorage.setItem('museum_recent_visits', JSON.stringify(recentVisits))
  }, [recentVisits])

  // Données du musée
  const { data: stats, isLoading: statsLoading } = useQuery(
    'museum-stats',
    () => museumApi.getStats(),
    { staleTime: 1000 * 60 * 5 }
  )

  const { data: featuredArtifacts, isLoading: featuredLoading } = useQuery(
    'featured-artifacts',
    () => museumApi.getFeaturedArtifacts(),
    { staleTime: 1000 * 60 * 5 }
  )

  // Favoris
  const toggleFavorite = (artifactId) => {
    setFavorites(prev => prev.includes(artifactId) 
      ? prev.filter(id => id !== artifactId) 
      : [...prev, artifactId])
  }

  const isFavorite = (artifactId) => favorites.includes(artifactId)

  // Ajouter une visite
  const addVisit = async (artifactId, duration = 0) => {
    const visit = {
      artifactId,
      timestamp: new Date().toISOString(),
      duration,
    }

    setRecentVisits(prev => {
      const filtered = prev.filter(v => v.artifactId !== artifactId)
      return [visit, ...filtered].slice(0, 20)
    })

    // Tracker la visite seulement si CSRF est prêt
    if (csrfReady) {
      try {
        await museumApi.trackVisit(artifactId, sessionId, duration)
      } catch (error) {
        console.error('Failed to track visit:', error)
      }
    }
  }

  // Scanner QR
  const scanQRCode = async (qrData) => {
    if (!csrfReady) return null
    try {
      const result = await museumApi.scanQRCode(qrData)
      return result
    } catch (error) {
      console.error('Failed to scan QR code:', error)
      return null
    }
  }

  const value = {
    sessionId,
    favorites,
    recentVisits,
    stats,
    featuredArtifacts,
    statsLoading,
    featuredLoading,
    toggleFavorite,
    isFavorite,
    addVisit,
    scanQRCode,
    csrfReady,
  }

  return (
    <MuseumContext.Provider value={value}>
      {children}
    </MuseumContext.Provider>
  )
}
