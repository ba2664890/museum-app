import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram,
  Youtube 
} from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  const footerSections = [
    {
      title: 'Visit',
      links: [
        { label: 'Plan Your Visit', href: '#' },
        { label: 'Hours & Admission', href: '#' },
        { label: 'Location & Access', href: '#' },
        { label: 'Group Visits', href: '#' },
      ]
    },
    {
      title: 'Explore',
      links: [
        { label: 'Collections', href: '/collections' },
        { label: 'Virtual Tour', href: '/virtual-tour' },
        { label: 'QR Scanner', href: '/qr-scanner' },
        { label: 'Search', href: '/search' },
      ]
    },
    {
      title: 'Learn',
      links: [
        { label: 'Educational Programs', href: '#' },
        { label: 'Research', href: '#' },
        { label: 'Publications', href: '#' },
        { label: 'Resources', href: '#' },
      ]
    },
    {
      title: 'About',
      links: [
        { label: 'Our Story', href: '/about' },
        { label: 'Team', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Contact', href: '#' },
      ]
    }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Museum Info */}
          <div className="lg:col-span-2">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MCN</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('home.title')}</h3>
                  <p className="text-gray-400 text-sm">
                    {t('home.subtitle')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-3 text-gray-300">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Dakar, Sénégal</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Phone className="w-5 h-5 text-amber-500" />
                <span>+221 33 123 4567</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Mail className="w-5 h-5 text-amber-500" />
                <span>info@museecivilisationsnoires.sn</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div 
              className="flex space-x-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-700 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + linkIndex * 0.1 }}
                  >
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-amber-500 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {t('footer.copyright')}
            </motion.p>
            
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('footer.developed')}
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer