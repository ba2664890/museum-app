import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMuseum } from '../context/MuseumContext'
import { Heart, Share2, Eye, Play, Volume2 } from 'lucide-react'
import { toast } from 'react-toastify'

const ArtifactCard = ({ artifact, size = 'medium' }) => {
  const { t } = useTranslation()
  const { toggleFavorite, isFavorite } = useMuseum()

  const sizeClasses = {
    small: 'w-64',
    medium: 'w-80',
    large: 'w-96',
  }

  const handleShare = async (e) => {
    e.preventDefault()
    const url = `${window.location.origin}/artifact/${artifact.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: artifact.name,
          text: artifact.description,
          url: url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success(t('notification.share_copied'))
      } catch (err) {
        console.log('Error copying to clipboard:', err)
      }
    }
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    toggleFavorite(artifact.id)
    
    const message = isFavorite(artifact.id) 
      ? t('notification.favorite_removed')
      : t('notification.favorite_added')
    
    toast.success(message)
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} group`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/artifact/${artifact.id}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={artifact.main_image}
              alt={artifact.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {artifact.is_featured && (
                <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {t('home.featured')}
                </span>
              )}
              {artifact.period && (
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {artifact.period.name}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isFavorite(artifact.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(artifact.id) ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* View Count */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white/90 text-sm">
              <Eye className="w-4 h-4" />
              <span>{Math.floor(Math.random() * 1000) + 100}</span>
            </div>

            {/* Media Indicators */}
            <div className="absolute bottom-3 right-3 flex space-x-2">
              {artifact.audio_guides && artifact.audio_guides.length > 0 && (
                <div className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                  <Volume2 className="w-3 h-3 text-gray-700" />
                </div>
              )}
              {artifact.videos && artifact.videos.length > 0 && (
                <div className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                  <Play className="w-3 h-3 text-gray-700" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 flex-1">
                {artifact.name}
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {artifact.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {artifact.culture && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {artifact.culture.name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{artifact.inventory_number}</span>
              </div>
            </div>

            {/* Collection Info */}
            {artifact.collection && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Collection: <span className="font-medium text-gray-700">{artifact.collection.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ArtifactCard