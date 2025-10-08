import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { museumApi } from '../services/api'

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
    // Generate or retrieve session ID
    let session = localStorage.getItem('museum_session_id')
    if (!session) {
      session = 'session_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('museum_session_id', session)
    }
    return session
  })

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('museum_favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('museum_favorites', JSON.stringify(favorites))
  }, [favorites])

  // Load recent visits from localStorage
  useEffect(() => {
    const savedVisits = localStorage.getItem('museum_recent_visits')
    if (savedVisits) {
      setRecentVisits(JSON.parse(savedVisits))
    }
  }, [])

  // Save recent visits to localStorage
  useEffect(() => {
    localStorage.setItem('museum_recent_visits', JSON.stringify(recentVisits))
  }, [recentVisits])

  // Fetch museum statistics
  const { data: stats, isLoading: statsLoading } = useQuery(
    'museum-stats',
    () => museumApi.getStats(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  // Fetch featured artifacts
  const { data: featuredArtifacts, isLoading: featuredLoading } = useQuery(
    'featured-artifacts',
    () => museumApi.getFeaturedArtifacts(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  // Toggle favorite
  const toggleFavorite = (artifactId) => {
    setFavorites(prev => {
      if (prev.includes(artifactId)) {
        return prev.filter(id => id !== artifactId)
      } else {
        return [...prev, artifactId]
      }
    })
  }

  // Check if artifact is favorite
  const isFavorite = (artifactId) => {
    return favorites.includes(artifactId)
  }

  // Add visit
  const addVisit = (artifactId, duration = 0) => {
    const visit = {
      artifactId,
      timestamp: new Date().toISOString(),
      duration,
    }
    
    setRecentVisits(prev => {
      const filtered = prev.filter(v => v.artifactId !== artifactId)
      return [visit, ...filtered].slice(0, 20) // Keep last 20 visits
    })

    // Track visit in backend
    museumApi.trackVisit(artifactId, sessionId, duration).catch(console.error)
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
  }

  return (
    <MuseumContext.Provider value={value}>
      {children}
    </MuseumContext.Provider>
  )
}