import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { museumApi } from '../services/api'
import { useMuseum } from '../context/MuseumContext'
import ArtifactCard from '../components/ArtifactCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Play, 
  Volume2, 
  Eye,
  Clock,
  MapPin,
  Maximize,
  X
} from 'lucide-react'

const ArtifactDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { toggleFavorite, isFavorite, addVisit } = useMuseum()
  const { showToast } = useToast()
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAudio, setSelectedAudio] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [visitDuration, setVisitDuration] = useState(0)

  // Fetch artifact details
  const { data: artifact, isLoading, error } = useQuery(
    ['artifact', id],
    () => museumApi.getArtifact(id),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  // Fetch related artifacts
  const { data: relatedArtifacts } = useQuery(
    ['related-artifacts', id],
    () => museumApi.getArtifacts({ 
      collection: artifact?.collection?.id,
      limit: 4 
    }),
    {
      enabled: !!artifact?.collection?.id,
      staleTime: 1000 * 60 * 5,
    }
  )

  // Track visit duration
  useEffect(() => {
    if (artifact) {
      addVisit(artifact.id, 0)
    }
    
    const timer = setInterval(() => {
      setVisitDuration(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
      if (artifact) {
        addVisit(artifact.id, visitDuration)
      }
    }
  }, [artifact, visitDuration, addVisit])

  const handleShare = async () => {
    const url = `${window.location.origin}/artifact/${artifact.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: artifact.name,
          text: artifact.description,
          url: url,
        })
        showToast('Partage réussi!', 'success')
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        showToast(t('notification.share_copied'), 'success')
      } catch (err) {
        console.log('Error copying to clipboard:', err)
      }
    }
  }

  const handleFavorite = () => {
    toggleFavorite(artifact.id)
    const message = isFavorite(artifact.id) 
      ? t('notification.favorite_removed')
      : t('notification.favorite_added')
    showToast(message, 'success')
  }

  const allImages = artifact ? [
    artifact.main_image,
    ...(artifact.additional_images?.map(img => img.image) || [])
  ] : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  console.log('artifact raw data:', artifact)
  console.log('QR code URL:', artifact.qr_code)

  if (error || !artifact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('error.page_not_found')}
          </h2>
          <p className="text-gray-600 mb-6">
            Œuvre non trouvée.
          </p>
          <Link
            to="/collections"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to={artifact.collection ? `/collection/${artifact.collection.id}` : '/collections'}
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="aspect-square bg-gray-100">
                  {allImages.length > 0 && (
                    <img
                      src={allImages[currentImageIndex]}
                      alt={`${artifact.name} - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {artifact.is_featured && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Œuvre vedette
                    </span>
                  )}
                  {artifact.period && (
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {artifact.period.name}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isFavorite(artifact.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(artifact.id) ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all duration-200"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Basic Information */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {artifact.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm">{artifact.inventory_number}</span>
                </div>
                
                {artifact.dimensions && (
                  <div className="flex items-center text-gray-600">
                    <Maximize className="w-4 h-4 mr-2" />
                    <span className="text-sm">{artifact.dimensions}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {Math.floor(visitDuration / 60)}:{(visitDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('artifact.description')}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {artifact.description}
                </p>
                
                {artifact.historical_context && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      {t('artifact.historical_context')}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {artifact.historical_context}
                    </p>
                  </>
                )}
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('artifact.technique')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artifact.technique && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">{t('artifact.technique')}</h3>
                    <p className="text-gray-600">{artifact.technique}</p>
                  </div>
                )}
                
                {artifact.material && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">{t('artifact.material')}</h3>
                    <p className="text-gray-600">{artifact.material}</p>
                  </div>
                )}
                
                {artifact.weight && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">{t('artifact.weight')}</h3>
                    <p className="text-gray-600">{artifact.weight}</p>
                  </div>
                )}
                
                {artifact.display_location && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">{t('artifact.location')}</h3>
                    <p className="text-gray-600">{artifact.display_location}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audio Guides */}
            {artifact.audio_guides && artifact.audio_guides.length > 0 && (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Volume2 className="w-5 h-5 mr-2 text-amber-600" />
                  {t('artifact.audio_guide')}
                </h3>
                
                <div className="space-y-3">
                  {artifact.audio_guides.map((audio) => (
                    <div 
                      key={audio.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAudio?.id === audio.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAudio(selectedAudio?.id === audio.id ? null : audio)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {audio.language.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {audio.narrator} • {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsPlaying(!isPlaying)
                          }}
                          className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      {selectedAudio?.id === audio.id && (
                        <motion.div 
                          className="mt-3 pt-3 border-t border-gray-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p className="text-sm text-gray-600">
                            {audio.transcript}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Videos */}
            {artifact.videos && artifact.videos.length > 0 && (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('artifact.videos')}
                </h3>
                
                <div className="space-y-3">
                  {artifact.videos.map((video) => (
                    <div 
                      key={video.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-center space-x-3">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Play className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {video.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {video.video_type} • {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Collection Info */}
            {artifact.collection && (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('artifact.collection')}
                </h3>
                
                <Link
                  to={`/collection/${artifact.collection.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {artifact.collection.name}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {artifact.collection.description}
                  </div>
                </Link>
              </motion.div>
            )}

              {/* QR Code */}
            
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('artifact.qr_code')}
                </h3>
                
                <div className="text-center">
                  {artifact.qr_code ? (
                    <img
                      src={artifact.qr_code}
                      alt={`QR Code ${artifact.inventory_number}`}
                      className="w-32 h-32 mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-xs text-gray-500">
                        QR Code<br />
                        {artifact.inventory_number}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    {t('artifact.scan_qr')}
                  </p>
                </div>
              </motion.div>

          </div>
        </div>

        {/* Related Artifacts */}
        {relatedArtifacts && relatedArtifacts.results && relatedArtifacts.results.length > 0 && (
          <motion.div 
            className="mt-12 bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('artifact.related')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArtifacts.results
                .filter(related => related.id !== artifact.id)
                .slice(0, 4)
                .map((related) => (
                  <ArtifactCard 
                    key={related.id} 
                    artifact={related} 
                    size="small" 
                  />
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                  <p className="text-gray-400">
                    {selectedVideo.description}
                  </p>
                  <p className="text-gray-500 mt-4">Lecteur vidéo en cours de développement</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ArtifactDetail