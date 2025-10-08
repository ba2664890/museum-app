import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { museumApi } from '../services/api'
import { useMuseum } from '../context/MuseumContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ArtifactCard from '../components/ArtifactCard'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import { 
  Search, 
  Camera, 
  Map, 
  ArrowRight, 
  Grid,
  Play,
  Volume2
} from 'lucide-react'



const Home = () => {
  const { t } = useTranslation()

  const { stats, featuredArtifacts, statsLoading, featuredLoading } = useMuseum()
  const [currentSlide, setCurrentSlide] = useState(0)
  console.log('Featured Artifacts:', featuredArtifacts)
  console.log('Stats:', stats)

  // Auto-advance featured artifacts
  useEffect(() => {
    if (featuredArtifacts && featuredArtifacts.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArtifacts.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredArtifacts])

  const quickActions = [
    {
      title: t('nav.search'),
      description: t('search.placeholder'),
      icon: Search,
      href: '/search',
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: t('nav.qr'),
      description: 'Scan QR codes on artifacts',
      icon: Camera,
      href: '/qr-scanner',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: t('nav.tour'),
      description: 'Explore the museum virtually',
      icon: Map,
      href: '/virtual-tour',
      color: 'from-orange-500 to-red-600',
    },
    {
      title: t('nav.collections'),
      description: 'Browse our collections',
      icon: Grid,
      href: '/collections',
      color: 'from-pink-500 to-rose-600',
    },
  ]

  if (statsLoading || featuredLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('home.explore')}
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('home.subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    to={action.href}
                    className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-amber-600 font-medium group-hover:text-amber-700">
                      <span>{t('common.explore')}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Artifacts */}
      {featuredArtifacts && featuredArtifacts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {t('home.featured')}
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t('home.subtitle')}
              </motion.p>
            </div>

            {/* Featured Artifact Carousel */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  {featuredArtifacts[currentSlide] && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                      <div className="relative h-96 lg:h-[500px]">
                        <img
                          src={featuredArtifacts[currentSlide].main_image}
                          alt={featuredArtifacts[currentSlide].name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {t('home.featured')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                          {featuredArtifacts[currentSlide].name}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-4">
                          {featuredArtifacts[currentSlide].description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featuredArtifacts[currentSlide].period && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {featuredArtifacts[currentSlide].period.name}
                            </span>
                          )}
                          {featuredArtifacts[currentSlide].culture && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {featuredArtifacts[currentSlide].culture.name}
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/artifact/${featuredArtifacts[currentSlide].id}`}
                          className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200"
                        >
                          <span>{t('common.view')}</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {featuredArtifacts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-amber-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      {stats && <StatsSection stats={stats.stats} />}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('common.discover')} {t('home.title')}
          </motion.h2>
          <motion.p 
            className="text-xl text-amber-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/collections"
              className="inline-flex items-center px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span>{t('nav.collections')}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/virtual-tour"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-600 transition-all duration-200"
            >
              <Map className="w-5 h-5 mr-2" />
              <span>{t('nav.tour')}</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home