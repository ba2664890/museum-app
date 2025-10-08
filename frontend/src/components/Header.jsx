import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../context/LanguageContext'
import MobileMenu from './MobileMenu'
import { 
  Menu, 
  X, 
  Search, 
  Camera, 
  Home, 
  Grid, 
  Map,
  Info 
} from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const location = useLocation()

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/collections', label: t('nav.collections'), icon: Grid },
    { path: '/search', label: t('nav.search'), icon: Search },
    { path: '/qr-scanner', label: t('nav.qr'), icon: Camera },
    { path: '/virtual-tour', label: t('nav.tour'), icon: Map },
    { path: '/about', label: t('nav.about'), icon: Info },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <motion.header 
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">MCN</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {t('home.title')}
                </h1>
                <p className="text-xs text-gray-600">
                  {currentLanguage === 'fr' ? 'Expérience Numérique' : 
                   currentLanguage === 'en' ? 'Digital Experience' : 
                   'Jafe-jafe bu numerik'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </>
  )
}

export default Header