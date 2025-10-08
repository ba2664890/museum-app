import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Users, 
  BookOpen,
  Award,
  Heart,
  Globe
} from 'lucide-react'

const About = () => {
  const { t } = useTranslation()

  const stats = [
    { label: 'Œuvres exposées', value: '15,000+' },
    { label: 'Visiteurs annuels', value: '200,000+' },
    { label: 'Années d\'histoire', value: '50+' },
    { label: 'Pays représentés', value: '25+' },
  ]

  const team = [
    {
      name: 'Dr. Aminata Sow',
      role: 'Conservatrice en Chef',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Spécialiste en arts africains avec plus de 20 ans d\'expérience.'
    },
    {
      name: 'Prof. Mamadou Diallo',
      role: 'Directeur de la Recherche',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Historien et expert en civilisations africaines anciennes.'
    },
    {
      name: 'Fatou Ndiaye',
      role: 'Responsable Éducation',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Passionnée par l\'éducation culturelle et les programmes jeunesse.'
    },
    {
      name: 'Cheikh Fall',
      role: 'Chef de Projet Digital',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Innovateur technologique spécialisé dans la préservation culturelle.'
    }
  ]

  const features = [
    {
      icon: BookOpen,
      title: 'Collections Permanentes',
      description: 'Des milliers d\'objets témoignant de la richesse culturelle africaine.'
    },
    {
      icon: Users,
      title: 'Programmes Éducatifs',
      description: 'Ateliers, conférences et visites guidées pour tous les âges.'
    },
    {
      icon: Award,
      title: 'Recherche Scientifique',
      description: 'Contributions majeures à l\'archéologie et l\'histoire africaine.'
    },
    {
      icon: Globe,
      title: 'Rayonnement International',
      description: 'Partenariats avec des musées du monde entier.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-red-600 opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1547234935-d39b970ca8d8?q=80&w=1920&auto=format&fit=crop)'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('about.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/collections"
                className="inline-flex items-center px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explorer les collections
              </Link>
              <Link
                to="/virtual-tour"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-600 transition-all duration-200"
              >
                <Globe className="w-5 h-5 mr-2" />
                Visite virtuelle
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.mission')}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.mission_text')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Le Musée des Civilisations Noires est dédié à la préservation, l'étude et la valorisation 
                du patrimoine culturel africain. À travers nos collections, expositions et programmes 
                éducatifs, nous cherchons à promouvoir la compréhension et l'appréciation des 
                civilisations africaines dans toute leur diversité et leur richesse.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des experts passionnés dédiés à la préservation et la promotion 
              du patrimoine culturel africain.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-amber-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('about.contact')}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Pour toute question ou information complémentaire, n'hésitez pas à nous contacter.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t('about.address')}</h3>
              <p className="text-gray-300 text-sm">
                Route de Rufisque<br />
                BP 206 Dakar<br />
                Sénégal
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t('about.hours')}</h3>
              <p className="text-gray-300 text-sm">
                Lundi - Vendredi: 9h00 - 17h00<br />
                Samedi - Dimanche: 10h00 - 18h00<br />
                Fermé le mardi
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Téléphone</h3>
              <p className="text-gray-300 text-sm">
                +221 33 123 4567<br />
                +221 77 123 4567<br />
                Fax: +221 33 123 4568
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-300 text-sm">
                info@museecivilisationsnoires.sn<br />
                education@museecivilisationsnoires.sn<br />
                research@museecivilisationsnoires.sn
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 mb-6">
              Suivez-nous sur les réseaux sociaux pour les dernières actualités
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Facebook
              </button>
              <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Twitter
              </button>
              <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Instagram
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About