import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { museumApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ArtifactCard from '../components/ArtifactCard'
import { Search, Filter, X, Grid } from 'lucide-react'

const SearchPage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    period: searchParams.get('period') || '',
    culture: searchParams.get('culture') || '',
    collection: searchParams.get('collection') || '',
    is_featured: searchParams.get('is_featured') === 'true'
  })

  // Fetch periods and cultures for filters
  const { data: periods } = useQuery('periods', () => museumApi.getPeriods())
  const { data: cultures } = useQuery('cultures', () => museumApi.getCultures())
  const { data: collections } = useQuery('collections', () => museumApi.getCollections())

  // Fetch search results
  const { data: searchResults, isLoading, error, refetch } = useQuery(
    ['search', searchTerm, filters],
    () => museumApi.searchArtifacts(searchTerm, filters),
    {
      enabled: searchTerm.length > 0 || Object.values(filters).some(v => v),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (filters.period) params.set('period', filters.period)
    if (filters.culture) params.set('culture', filters.culture)
    if (filters.collection) params.set('collection', filters.collection)
    if (filters.is_featured) params.set('is_featured', 'true')
    
    setSearchParams(params)
  }, [searchTerm, filters, setSearchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      refetch()
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      period: '',
      culture: '',
      collection: '',
      is_featured: false
    })
    setSearchTerm('')
  }

  const hasActiveFilters = Object.values(filters).some(v => v) || searchTerm

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('search.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('search.placeholder')}
          </p>
        </motion.div>

        {/* Search Bar and Filters */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>{t('search.filters')}</span>
              {hasActiveFilters && (
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                  {Object.values(filters).filter(v => v).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium"
            >
              {t('search.title')}
            </button>
          </form>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Period Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('search.filters.period')}
                    </label>
                    <select
                      value={filters.period}
                      onChange={(e) => handleFilterChange('period', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                    >
                      <option value="">{t('search.filters.period')}</option>
                      {periods?.results?.map(period => (
                        <option key={period.id} value={period.id}>
                          {period.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Culture Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('search.filters.culture')}
                    </label>
                    <select
                      value={filters.culture}
                      onChange={(e) => handleFilterChange('culture', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                    >
                      <option value="">{t('search.filters.culture')}</option>
                      {cultures?.results?.map(culture => (
                        <option key={culture.id} value={culture.id}>
                          {culture.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Collection Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('search.filters.collection')}
                    </label>
                    <select
                      value={filters.collection}
                      onChange={(e) => handleFilterChange('collection', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                    >
                      <option value="">{t('search.filters.collection')}</option>
                      {collections?.results?.map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('search.filters.type')}
                    </label>
                    <select
                      value={filters.is_featured}
                      onChange={(e) => handleFilterChange('is_featured', e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                    >
                      <option value="">Tous types</option>
                      <option value="true">Œuvres vedettes</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="text-amber-600 hover:text-amber-700 font-medium transition-colors inline-flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {t('search.clear_filters')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        {searchResults && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t('search.results', { count: searchResults.count || 0 })}
              </h2>
              
              {searchResults.count > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Grid className="w-4 h-4" />
                  <span>
                    {searchResults.results?.length || 0} sur {searchResults.count || 0}
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  {t('common.error')}
                </div>
                <button
                  onClick={() => refetch()}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {t('common.retry')}
                </button>
              </div>
            ) : searchResults.results?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.results.map((artifact, index) => (
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
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('search.no_results')}
                </h3>
                <p className="text-gray-600 mb-6">
                  Aucun résultat ne correspond à votre recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {t('search.clear_filters')}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!searchResults && !isLoading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('search.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              Utilisez la barre de recherche ci-dessus pour trouver des œuvres.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'masque',
                'sculpture',
                'yoruba',
                'ashanti',
                'kente'
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SearchPage