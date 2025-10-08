import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMuseum } from '../context/MuseumContext'
import { 
  Search, 
  Camera, 
  Map, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Play
} from 'lucide-react'

const HeroSection = () => {
  const { t } = useTranslation()
  const { featuredArtifacts, stats } = useMuseum()
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1547234935-d39b970ca8d8?q=80&w=1920&auto=format&fit=crop',
      title: 'African Heritage',
      subtitle: 'Discover ancient civilizations'
    },
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&auto=format&fit=crop',
      title: 'Cultural Treasures',
      subtitle: 'Explore our collections'
    },
    {
      url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=1920&auto=format&fit=crop',
      title: 'Digital Experience',
      subtitle: 'Immersive technology'
    }
  ]

  // Auto-rotate hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
  }

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const currentHero = heroImages[currentHeroIndex]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHeroIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentHero.url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={prevHero}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={nextHero}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {t('home.title')}
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                {t('home.subtitle')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                <Link
                  to="/collections"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>{t('home.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <Play className="w-5 h-5 mr-2" />
                  <span>Watch Introduction</span>
                </button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.3 }}
              >
                {[
                  { label: t('home.stats.artifacts'), value: stats?.total_artifacts || '1000+' },
                  { label: t('home.stats.collections'), value: stats?.total_collections || '50+' },
                  { label: t('home.stats.cultures'), value: stats?.total_cultures || '25+' },
                  { label: t('home.stats.visitors'), value: stats?.total_visits || '10K+' },
                ].map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Featured Artifact Preview */}
            {featuredArtifacts && featuredArtifacts.length > 0 && (
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4">
                      <img
                        src={featuredArtifacts[0].main_image}
                        alt={featuredArtifacts[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {featuredArtifacts[0].name}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-3">
                      {featuredArtifacts[0].description}
                    </p>
                    <Link
                      to={`/artifact/${featuredArtifacts[0].id}`}
                      className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium"
                    >
                      <span>View Artifact</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
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
                onClick={() => setIsVideoPlaying(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">Video Introduction</p>
                  <p className="text-gray-400 mt-2">Coming Soon</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HeroSection