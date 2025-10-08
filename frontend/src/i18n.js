import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

// Translation resources
const resources = {
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.collections': 'Collections',
      'nav.search': 'Recherche',
      'nav.qr': 'Scan QR',
      'nav.tour': 'Visite virtuelle',
      'nav.about': 'À propos',
      
      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.retry': 'Réessayer',
      'common.close': 'Fermer',
      'common.play': 'Lire',
      'common.pause': 'Pause',
      'common.volume': 'Volume',
      'common.fullscreen': 'Plein écran',
      'common.share': 'Partager',
      'common.favorite': 'Favori',
      'common.download': 'Télécharger',
      'common.view': 'Voir',
      'common.explore': 'Explorer',
      'common.discover': 'Découvrir',
      'common.learn': 'Apprendre',
      'common.listen': 'Écouter',
      'common.watch': 'Regarder',
      
      // Languages
      'lang.fr': 'Français',
      'lang.en': 'English',
      'lang.wo': 'Wolof',
      
      // Home page
      'home.title': 'Musée des Civilisations Noires',
      'home.subtitle': 'Découvrez l\'héritage culturel africain à travers une expérience numérique immersive',
      'home.featured': 'Œuvres vedettes',
      'home.explore': 'Explorer les collections',
      'home.virtual_tour': 'Visite virtuelle',
      'home.qr_scanner': 'Scanner QR',
      'home.stats.artifacts': 'Œuvres',
      'home.stats.collections': 'Collections',
      'home.stats.visitors': 'Visiteurs',
      'home.stats.cultures': 'Cultures',
      
      // Collections
      'collections.title': 'Collections',
      'collections.subtitle': 'Explorez nos collections thématiques',
      'collections.all': 'Toutes les collections',
      'collections.artifacts_count': '{{count}} œuvres',
      'collections.view_artifacts': 'Voir les œuvres',
      
      // Collection detail
      'collection.detail.title': 'Collection',
      'collection.detail.curator': 'Conservateur',
      'collection.detail.artifacts': 'Œuvres de la collection',
      'collection.detail.back': 'Retour aux collections',
      
      // Artifacts
      'artifact.title': 'Œuvre',
      'artifact.inventory_number': 'Numéro d\'inventaire',
      'artifact.description': 'Description',
      'artifact.historical_context': 'Contexte historique',
      'artifact.technique': 'Technique',
      'artifact.material': 'Matériau',
      'artifact.dimensions': 'Dimensions',
      'artifact.weight': 'Poids',
      'artifact.period': 'Période',
      'artifact.culture': 'Culture',
      'artifact.collection': 'Collection',
      'artifact.location': 'Emplacement',
      'artifact.acquisition': 'Acquisition',
      'artifact.audio_guide': 'Audio guide',
      'artifact.videos': 'Vidéos',
      'artifact.images': 'Images',
      'artifact.related': 'Œuvres similaires',
      'artifact.share': 'Partager cette œuvre',
      'artifact.qr_code': 'Code QR',
      'artifact.scan_qr': 'Scanner pour visiter',
      
      // Search
      'search.title': 'Recherche',
      'search.placeholder': 'Rechercher une œuvre, une culture...',
      'search.filters': 'Filtres',
      'search.filters.period': 'Période',
      'search.filters.culture': 'Culture',
      'search.filters.collection': 'Collection',
      'search.filters.type': 'Type',
      'search.results': '{{count}} résultats',
      'search.no_results': 'Aucun résultat trouvé',
      'search.clear_filters': 'Effacer les filtres',
      
      // QR Scanner
      'qr.title': 'Scanner QR',
      'qr.subtitle': 'Scannez le code QR d\'une œuvre pour en savoir plus',
      'qr.permission': 'Autorisez l\'accès à la caméra pour scanner les codes QR',
      'qr.scanning': 'Scan en cours...',
      'qr.success': 'Code QR scanné avec succès',
      'qr.error': 'Erreur lors du scan',
      'qr.not_found': 'Œuvre non trouvée',
      'qr.manual': 'Entrer manuellement',
      'qr.manual_placeholder': 'Numéro d\'inventaire ou ID',
      
      // Virtual Tour
      'tour.title': 'Visite virtuelle',
      'tour.subtitle': 'Explorez le musée virtuellement',
      'tour.start': 'Commencer la visite',
      'tour.next': 'Suivant',
      'tour.previous': 'Précédent',
      'tour.complete': 'Visite terminée',
      'tour.progress': 'Progression de la visite',
      
      // About
      'about.title': 'À propos du musée',
      'about.description': 'Le Musée des Civilisations Noires est un lieu emblématique dédié à la préservation et à la valorisation du patrimoine culturel africain.',
      'about.mission': 'Notre mission',
      'about.mission_text': 'Préserver, étudier et partager la richesse culturelle des civilisations africaines avec le monde entier.',
      'about.history': 'Notre histoire',
      'about.contact': 'Contact',
      'about.address': 'Adresse',
      'about.hours': 'Horaires',
      'about.ticket': 'Billetterie',
      
      // Footer
      'footer.copyright': '© 2025 Musée des Civilisations Noires. Tous droits réservés.',
      'footer.developed': 'Développé pour le Dakar Slush\'D 2025',
      
      // Errors
      'error.page_not_found': 'Page non trouvée',
      'error.server_error': 'Erreur serveur',
      'error.try_again': 'Réessayer',
      'error.go_home': 'Retour à l\'accueil',
      
      // Notifications
      'notification.visit_tracked': 'Visite enregistrée',
      'notification.favorite_added': 'Ajouté aux favoris',
      'notification.favorite_removed': 'Retiré des favoris',
      'notification.share_copied': 'Lien copié dans le presse-papier',
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.collections': 'Collections',
      'nav.search': 'Search',
      'nav.qr': 'QR Scan',
      'nav.tour': 'Virtual Tour',
      'nav.about': 'About',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.retry': 'Retry',
      'common.close': 'Close',
      'common.play': 'Play',
      'common.pause': 'Pause',
      'common.volume': 'Volume',
      'common.fullscreen': 'Fullscreen',
      'common.share': 'Share',
      'common.favorite': 'Favorite',
      'common.download': 'Download',
      'common.view': 'View',
      'common.explore': 'Explore',
      'common.discover': 'Discover',
      'common.learn': 'Learn',
      'common.listen': 'Listen',
      'common.watch': 'Watch',
      
      // Languages
      'lang.fr': 'Français',
      'lang.en': 'English',
      'lang.wo': 'Wolof',
      
      // Home page
      'home.title': 'Museum of Black Civilizations',
      'home.subtitle': 'Discover African cultural heritage through an immersive digital experience',
      'home.featured': 'Featured Artifacts',
      'home.explore': 'Explore Collections',
      'home.virtual_tour': 'Virtual Tour',
      'home.qr_scanner': 'QR Scanner',
      'home.stats.artifacts': 'Artifacts',
      'home.stats.collections': 'Collections',
      'home.stats.visitors': 'Visitors',
      'home.stats.cultures': 'Cultures',
      
      // Collections
      'collections.title': 'Collections',
      'collections.subtitle': 'Explore our thematic collections',
      'collections.all': 'All Collections',
      'collections.artifacts_count': '{{count}} artifacts',
      'collections.view_artifacts': 'View Artifacts',
      
      // Collection detail
      'collection.detail.title': 'Collection',
      'collection.detail.curator': 'Curator',
      'collection.detail.artifacts': 'Collection Artifacts',
      'collection.detail.back': 'Back to Collections',
      
      // Artifacts
      'artifact.title': 'Artifact',
      'artifact.inventory_number': 'Inventory Number',
      'artifact.description': 'Description',
      'artifact.historical_context': 'Historical Context',
      'artifact.technique': 'Technique',
      'artifact.material': 'Material',
      'artifact.dimensions': 'Dimensions',
      'artifact.weight': 'Weight',
      'artifact.period': 'Period',
      'artifact.culture': 'Culture',
      'artifact.collection': 'Collection',
      'artifact.location': 'Location',
      'artifact.acquisition': 'Acquisition',
      'artifact.audio_guide': 'Audio Guide',
      'artifact.videos': 'Videos',
      'artifact.images': 'Images',
      'artifact.related': 'Related Artifacts',
      'artifact.share': 'Share this Artifact',
      'artifact.qr_code': 'QR Code',
      'artifact.scan_qr': 'Scan to visit',
      
      // Search
      'search.title': 'Search',
      'search.placeholder': 'Search artifacts, cultures...',
      'search.filters': 'Filters',
      'search.filters.period': 'Period',
      'search.filters.culture': 'Culture',
      'search.filters.collection': 'Collection',
      'search.filters.type': 'Type',
      'search.results': '{{count}} results',
      'search.no_results': 'No results found',
      'search.clear_filters': 'Clear filters',
      
      // QR Scanner
      'qr.title': 'QR Scanner',
      'qr.subtitle': 'Scan an artifact QR code to learn more',
      'qr.permission': 'Allow camera access to scan QR codes',
      'qr.scanning': 'Scanning...',
      'qr.success': 'QR code scanned successfully',
      'qr.error': 'Scan error',
      'qr.not_found': 'Artifact not found',
      'qr.manual': 'Enter manually',
      'qr.manual_placeholder': 'Inventory number or ID',
      
      // Virtual Tour
      'tour.title': 'Virtual Tour',
      'tour.subtitle': 'Explore the museum virtually',
      'tour.start': 'Start Tour',
      'tour.next': 'Next',
      'tour.previous': 'Previous',
      'tour.complete': 'Tour Complete',
      'tour.progress': 'Tour Progress',
      
      // About
      'about.title': 'About the Museum',
      'about.description': 'The Museum of Black Civilizations is an iconic institution dedicated to preserving and promoting African cultural heritage.',
      'about.mission': 'Our Mission',
      'about.mission_text': 'To preserve, study, and share the cultural richness of African civilizations with the world.',
      'about.history': 'Our History',
      'about.contact': 'Contact',
      'about.address': 'Address',
      'about.hours': 'Hours',
      'about.ticket': 'Tickets',
      
      // Footer
      'footer.copyright': '© 2025 Museum of Black Civilizations. All rights reserved.',
      'footer.developed': 'Developed for Dakar Slush\'D 2025',
      
      // Errors
      'error.page_not_found': 'Page not found',
      'error.server_error': 'Server error',
      'error.try_again': 'Try again',
      'error.go_home': 'Go to Home',
      
      // Notifications
      'notification.visit_tracked': 'Visit tracked',
      'notification.favorite_added': 'Added to favorites',
      'notification.favorite_removed': 'Removed from favorites',
      'notification.share_copied': 'Link copied to clipboard',
    }
  },
  wo: {
    translation: {
      // Navigation
      'nav.home': 'Njuuti',
      'nav.collections': 'Koleksiyon',
      'nav.search': 'Seetlu',
      'nav.qr': 'QR Scan',
      'nav.tour': 'Tour virtuwaal',
      'nav.about': 'Ci',
      
      // Common
      'common.loading': 'Nangu...',
      'common.error': 'Jafe-jafe',
      'common.retry': 'Dencat',
      'common.close': 'Tëggi',
      'common.play': 'Jëfandikukat',
      'common.pause': 'Pawz',
      'common.volume': 'Volume',
      'common.fullscreen': 'Liggéey bu mag',
      'common.share': 'Wut',
      'common.favorite': 'Bég',
      'common.download': 'Tëggin',
      'common.view': 'Gis',
      'common.explore': 'Seeti',
      'common.discover': 'Wut',
      'common.learn': 'Jàng',
      'common.listen': 'Noppal',
      'common.watch': 'Gis',
      
      // Languages
      'lang.fr': 'Français',
      'lang.en': 'English',
      'lang.wo': 'Wolof',
      
      // Home page
      'home.title': 'Miseu bu Sivilizasyon Noo',
      'home.subtitle': 'Wut xarnu kiltir Afrig ak jafe-jafe bu numerik',
      'home.featured': 'Jafe-jafe yu am solo',
      'home.explore': 'Seeti koleksiyon',
      'home.virtual_tour': 'Tour virtuwaal',
      'home.qr_scanner': 'QR Scanner',
      'home.stats.artifacts': 'Jafe-jafe',
      'home.stats.collections': 'Koleksiyon',
      'home.stats.visitors': 'Suturaat',
      'home.stats.cultures': 'Kiltir',
      
      // Collections
      'collections.title': 'Koleksiyon',
      'collections.subtitle': 'Seeti koleksiyon yu am solo',
      'collections.all': 'Koleksiyon yépp',
      'collections.artifacts_count': '{{count}} jafe-jafe',
      'collections.view_artifacts': 'Gis jafe-jafe',
      
      // Collection detail
      'collection.detail.title': 'Koleksiyon',
      'collection.detail.curator': 'Kuraatër',
      'collection.detail.artifacts': 'Jafe-jafe bu koleksiyon',
      'collection.detail.back': 'Dellu ci koleksiyon',
      
      // Artifacts
      'artifact.title': 'Jafe-jafe',
      'artifact.inventory_number': 'Nimero inventory',
      'artifact.description': 'Xibaat',
      'artifact.historical_context': 'Xarnu tariix',
      'artifact.technique': 'Tehnik',
      'artifact.material': 'Materiyal',
      'artifact.dimensions': 'Dimeñsiyon',
      'artifact.weight': 'Pwa',
      'artifact.period': 'Xarnu',
      'artifact.culture': 'Kiltir',
      'artifact.collection': 'Koleksiyon',
      'artifact.location': 'Pene',
      'artifact.acquisition': 'Jafe-jafe',
      'artifact.audio_guide': 'Audio guide',
      'artifact.videos': 'Video',
      'artifact.images': 'Image',
      'artifact.related': 'Jafe-jafe yu mel ni',
      'artifact.share': 'Wut jafe-jafe',
      'artifact.qr_code': 'QR Code',
      'artifact.scan_qr': 'Scan ngir gis',
      
      // Search
      'search.title': 'Seetlu',
      'search.placeholder': 'Seet jafe-jafe, kiltir...',
      'search.filters': 'Fitru',
      'search.filters.period': 'Xarnu',
      'search.filters.culture': 'Kiltir',
      'search.filters.collection': 'Koleksiyon',
      'search.filters.type': 'Naka',
      'search.results': '{{count}} njariñ',
      'search.no_results': 'Jafe-jafe du am',
      'search.clear_filters': 'Dagg fitru',
      
      // QR Scanner
      'qr.title': 'QR Scanner',
      'qr.subtitle': 'Scan QR code bu jafe-jafe ngir xam lu gën',
      'qr.permission': 'Nangu camera ngir scan QR code',
      'qr.scanning': 'Scan...',
      'qr.success': 'QR code scan na',
      'qr.error': 'Jafe-jafe ci scan',
      'qr.not_found': 'Jafe-jafe du am',
      'qr.manual': 'Bind bu ñu koy jar',
      'qr.manual_placeholder': 'Nimero inventory walla ID',
      
      // Virtual Tour
      'tour.title': 'Tour virtuwaal',
      'tour.subtitle': 'Seeti miseu ci virtuwaal',
      'tour.start': 'Toppal tour',
      'tour.next': 'Ci topp',
      'tour.previous': 'Ci kaw',
      'tour.complete': 'Tour mujj',
      'tour.progress': 'Toppandoo tour',
      
      // About
      'about.title': 'Ci miseu bi',
      'about.description': 'Miseu bu Sivilizasyon Noo dafa nekk beneen bopp bu am solo bu jàppale ak wut xarnu kiltir Afrig.',
      'about.mission': 'Suturaay bu',
      'about.mission_text': 'Jàppale, xamle, ak wut xarnu kiltir Afrig ak àdduna.',
      'about.history': 'Tariix bu',
      'about.contact': 'Jàppale',
      'about.address': 'Pene',
      'about.hours': 'Cagga',
      'about.ticket': 'Tiket',
      
      // Footer
      'footer.copyright': '© 2025 Miseu bu Sivilizasyon Noo. Benn ci du dugg.',
      'footer.developed': 'Jàppale ngir Dakar Slush\'D 2025',
      
      // Errors
      'error.page_not_found': 'Xew-xew du am',
      'error.server_error': 'Jafe-jafe serveer',
      'error.try_again': 'Dencat',
      'error.go_home': 'Dellu ci njuuti',
      
      // Notifications
      'notification.visit_tracked': 'Suturaay mujj',
      'notification.favorite_added': 'Yokk ci bég yu',
      'notification.favorite_removed': 'Dagg ci bég yu',
      'notification.share_copied': 'Lien copié ci presse-papier',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n