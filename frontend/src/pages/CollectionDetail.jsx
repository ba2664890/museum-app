import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { museumApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ArtifactCard from '../components/ArtifactCard'
import { ArrowLeft, Grid, Eye } from 'lucide-react'
import { Search } from 'lucide-react'

const CollectionDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  // Fetch collection details
  const { data: collection, isLoading: collectionLoading, error: collectionError } = useQuery(
    ['collection', id],
    () => museumApi.getCollection(id),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  // Fetch artifacts in this collection
  const { data: artifacts, isLoading: artifactsLoading } = useQuery(
    ['collection-artifacts', id],
    () => museumApi.getArtifacts({ collection: id }),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  if (collectionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (collectionError || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('error.page_not_found')}
          </h2>
          <p className="text-gray-600 mb-6">
            Collection non trouvée.
          </p>
          <Link
            to="/collections"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('collection.detail.back')}
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
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/collections"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('collection.detail.back')}
          </Link>
        </motion.div>

        {/* Collection Header */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Collection Image */}
            <div className="lg:col-span-1">
              {collection.image ? (
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <Grid className="w-16 h-16 text-amber-600" />
                </div>
              )}
            </div>

            {/* Collection Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {collection.name}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {collection.description}
              </p>
              
              {collection.curator && (
                <div className="flex items-center text-gray-700 mb-4">
                  <span className="font-semibold mr-2">{t('collection.detail.curator')}:</span>
                  <span>{collection.curator}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-700">
                    {collection.artifact_count || 0} {t('collections.artifacts_count', { count: collection.artifact_count || 0 })}
                  </span>
                </div>
                
                {collection.created_at && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {new Date(collection.created_at).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  Collection
                </span>
                {collection.artifact_count > 10 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Rich Collection
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Artifacts Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('collection.detail.artifacts')}
          </h2>

          {artifactsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artifacts?.results?.map((artifact, index) => (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ArtifactCard artifact={artifact} size="medium" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!artifactsLoading && (!artifacts?.results || artifacts.results.length === 0) && (
            <div className="text-center py-12">
              <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune œuvre dans cette collection
              </h3>
              <p className="text-gray-600 mb-6">
                Cette collection ne contient pas encore d'œuvres.
              </p>
              <Link
                to="/search"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Explorer d'autres œuvres
              </Link>
            </div>
          )}
        </motion.div>

        {/* Related Collections */}
        <motion.div 
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Collections Similaires
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for similar collections */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CollectionDetail