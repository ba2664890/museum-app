import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MobileMenu = ({ isOpen, onClose, navItems, isActive }) => {
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 md:hidden"
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={menuVariants}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Musée des Civilisations Noires
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MobileMenu