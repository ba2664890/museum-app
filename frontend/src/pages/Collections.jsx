import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { museumApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Grid, Search, ArrowRight } from 'lucide-react'

const Collections = () => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch collections
  const { data: collections, isLoading, error } = useQuery(
    'collections',
    () => museumApi.getCollections(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  // Filter collections based on search term
  const filteredCollections = collections?.results?.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('common.error')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('collections.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('collections.subtitle')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={`/collection/${collection.id}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
              >
                {/* Collection Image */}
                <div className="relative h-48 overflow-hidden">
                  {collection.image ? (
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <Grid className="w-16 h-16 text-amber-600" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Artifact Count */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {collection.artifact_count || 0} {t('collections.artifacts_count', { count: collection.artifact_count || 0 })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {collection.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {collection.description}
                  </p>
                  
                  {collection.curator && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="font-medium">
                        {t('collection.detail.curator')}: {collection.curator}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {collection.created_at && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {new Date(collection.created_at).getFullYear()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-amber-600 font-medium group-hover:text-amber-700">
                      <span>{t('collections.view_artifacts')}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('search.no_results')}
            </h3>
            <p className="text-gray-600 mb-6">
              Aucune collection ne correspond à votre recherche.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              {t('search.clear_filters')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Collections