import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCountUp } from '../hooks/useCountUp'

const StatsSection = ({ stats }) => {
  const { t } = useTranslation()

  const statItems = [
    {
      label: t('home.stats.artifacts'),
      value: stats?.total_artifacts || 0,
      icon: '🏛️',
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: t('home.stats.collections'),
      value: stats?.total_collections || 0,
      icon: '📚',
      color: 'from-blue-500 to-purple-600',
    },
    {
      label: t('home.stats.visitors'),
      value: stats?.total_visits || 0,
      icon: '👥',
      color: 'from-green-500 to-teal-600',
    },
    {
      label: t('home.stats.cultures'),
      value: stats?.total_cultures || 0,
      icon: '🌍',
      color: 'from-pink-500 to-rose-600',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Museum in Numbers
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover the scale and richness of our cultural heritage collection
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => {
            const count = useCountUp(stat.value, 2000 + index * 200)
            
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative mb-4">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                    {stat.icon}
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  {count}
                </motion.div>
                
                <div className="text-lg font-medium text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-flex items-center space-x-4 bg-gray-100 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-700 font-medium">
              Live visitor count: {stats?.total_visits || 0}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection