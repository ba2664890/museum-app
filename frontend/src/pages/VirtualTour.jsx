import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { museumApi } from '../services/api'
import { useMuseum } from '../context/MuseumContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Map, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Maximize,
  X
} from 'lucide-react'

const VirtualTour = () => {
  const { t } = useTranslation()
  const { addVisit } = useMuseum()
  
  const [currentStop, setCurrentStop] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [tourStarted, setTourStarted] = useState(false)
  const [tourCompleted, setTourCompleted] = useState(false)
  const [stopTimer, setStopTimer] = useState(0)

  // Fetch featured artifacts for the tour
  const { data: tourArtifacts, isLoading } = useQuery(
    'tour-artifacts',
    () => museumApi.getFeaturedArtifacts(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  const tourStops = tourArtifacts || []
  const currentArtifact = tourStops[currentStop]

  // Timer for tracking visit duration
  useEffect(() => {
    let interval
    if (tourStarted && !tourCompleted) {
      interval = setInterval(() => {
        setStopTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [tourStarted, tourCompleted])

  // Auto-advance tour
  useEffect(() => {
    let timeout
    if (isPlaying && currentArtifact) {
      timeout = setTimeout(() => {
        handleNext()
      }, 10000) // 10 seconds per stop
    }
    return () => clearTimeout(timeout)
  }, [isPlaying, currentStop, currentArtifact])

  const startTour = () => {
    setTourStarted(true)
    setIsPlaying(true)
    if (currentArtifact) {
      addVisit(currentArtifact.id, 0)
    }
  }

  const handleNext = () => {
    if (currentArtifact) {
      addVisit(currentArtifact.id, stopTimer)
    }
    
    if (currentStop < tourStops.length - 1) {
      setCurrentStop(currentStop + 1)
      setStopTimer(0)
      if (currentArtifact) {
        addVisit(tourStops[currentStop + 1].id, 0)
      }
    } else {
      completeTour()
    }
  }

  const handlePrevious = () => {
    if (currentStop > 0) {
      if (currentArtifact) {
        addVisit(currentArtifact.id, stopTimer)
      }
      setCurrentStop(currentStop - 1)
      setStopTimer(0)
      if (tourStops[currentStop - 1]) {
        addVisit(tourStops[currentStop - 1].id, 0)
      }
    }
  }

  const completeTour = () => {
    if (currentArtifact) {
      addVisit(currentArtifact.id, stopTimer)
    }
    setTourCompleted(true)
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const progress = tourStops.length > 0 ? ((currentStop + 1) / tourStops.length) * 100 : 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (tourStops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('tour.title')}
          </h2>
          <p className="text-gray-600 mb-6">
            Aucune œuvre disponible pour la visite virtuelle.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {!tourStarted ? (
        /* Tour Introduction */
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('tour.title')}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('tour.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Visite Guidée</h3>
                <p className="text-gray-600 text-sm">
                  Parcourez les œuvres vedettes du musée avec des commentaires audio
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Map className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Navigation Intuitive</h3>
                <p className="text-gray-600 text-sm">
                  Interface facile à utiliser avec contrôles intuitifs
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Audio Guide</h3>
                <p className="text-gray-600 text-sm">
                  Descriptions audio dans votre langue préférée
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('tour.progress')}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Nombre d'œuvres à visiter :</span>
                <span className="font-semibold text-amber-600">{tourStops.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Durée estimée :</span>
                <span className="font-semibold text-amber-600">
                  {Math.ceil(tourStops.length * 2)} minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Langues disponibles :</span>
                <span className="font-semibold text-amber-600">Français, English, Wolof</span>
              </div>
            </div>

            <button
              onClick={startTour}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {t('tour.start')}
            </button>
          </motion.div>
        </div>
      ) : tourCompleted ? (
        /* Tour Completion */
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {t('tour.complete')} 🎉
            </h1>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Récapitulatif de votre visite
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Œuvres visitées :</span>
                  <span className="font-semibold text-amber-600">{tourStops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée totale :</span>
                  <span className="font-semibold text-amber-600">
                    {Math.floor(stopTimer / 60)} minutes {stopTimer % 60} secondes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collections explorées :</span>
                  <span className="font-semibold text-amber-600">
                    {new Set(tourStops.map(a => a.collection?.name)).size}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setTourCompleted(false)
                  setTourStarted(false)
                  setCurrentStop(0)
                  setStopTimer(0)
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium"
              >
                Refaire la visite
              </button>
              <Link
                to="/collections"
                className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Explorer les collections
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Tour Interface */
        <div className={`min-h-screen ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
          {/* Progress Bar */}
          <div className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('tour.progress')}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {currentStop + 1} / {tourStops.length}
                  </span>
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Maximize className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStop}
                className="grid grid-cols-1 lg:grid-cols-2 h-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {/* Image Section */}
                <div className="relative bg-black">
                  {currentArtifact?.main_image ? (
                    <img
                      src={currentArtifact.main_image}
                      alt={currentArtifact.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white text-center">
                        <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Aucune image disponible</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Audio Toggle */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      {audioEnabled ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <VolumeX className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="bg-white p-8 overflow-y-auto">
                  <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {currentArtifact?.name}
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {currentArtifact?.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="space-y-4 mb-8">
                      {currentArtifact?.period && (
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Période:</span>
                          <span className="text-gray-600">{currentArtifact.period.name}</span>
                        </div>
                      )}
                      
                      {currentArtifact?.culture && (
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Culture:</span>
                          <span className="text-gray-600">{currentArtifact.culture.name}</span>
                        </div>
                      )}
                      
                      {currentArtifact?.technique && (
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Technique:</span>
                          <span className="text-gray-600">{currentArtifact.technique}</span>
                        </div>
                      )}
                      
                      {currentArtifact?.material && (
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Matériau:</span>
                          <span className="text-gray-600">{currentArtifact.material}</span>
                        </div>
                      )}
                    </div>

                    {/* Audio Guide Placeholder */}
                    {audioEnabled && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <Volume2 className="w-5 h-5 text-amber-600" />
                          <div>
                            <h4 className="font-semibold text-amber-900">Audio Guide</h4>
                            <p className="text-sm text-amber-700">
                              Description audio disponible en {t('lang.fr')}, {t('lang.en')}, {t('lang.wo')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handlePrevious}
                        disabled={currentStop === 0}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <SkipBack className="w-4 h-4" />
                        <span>{t('tour.previous')}</span>
                      </button>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={togglePlayPause}
                          className="p-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                        
                        <span className="text-sm text-gray-600">
                          {Math.floor(stopTimer / 60)}:{(stopTimer % 60).toString().padStart(2, '0')}
                        </span>
                      </div>

                      <button
                        onClick={handleNext}
                        className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        <span>
                          {currentStop === tourStops.length - 1 ? 'Terminer' : t('tour.next')}
                        </span>
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default VirtualTour