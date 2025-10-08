# Musée des Civilisations Noires - Expérience Numérique

## 🎨 Projet Hackathon - Dakar Slush'D 2025

Une solution digitale moderne et interactive pour le Musée des Civilisations Noires, permettant aux visiteurs d'explorer les collections à travers une expérience multimédia enrichie avec scan QR, guides audio, et visite virtuelle.

## ✨ Fonctionnalités Principales

### 🏛️ Expérience Utilisateur
- **Interface moderne et responsive** - Design élégant avec animations fluides
- **Support multilingue** - Français, Anglais, Wolof
- **Navigation intuitive** - Accès facile aux collections et œuvres
- **Mode sombre/clair** - Adaptation aux préférences utilisateur

### 📱 Fonctionnalités Mobile
- **Scan QR Code** - Accès instantané aux informations des œuvres
- **Audio guides** - Descriptions audio en plusieurs langues
- **Vidéos éducatives** - Contenus multimédia enrichissants
- **Mode hors ligne** - Accès aux contenus téléchargés

### 🔍 Exploration Avancée
- **Recherche intelligente** - Recherche par mots-clés, périodes, cultures
- **Filtres avancés** - Filtrage par collections, types, matériaux
- **Œuvres vedettes** - Mise en avant des pièces exceptionnelles
- **Parcours thématiques** - Itinéraires de visite suggérés

### 📊 Analytics & Suivi
- **Statistiques de visite** - Suivi de l'engagement utilisateur
- **Préférences linguistiques** - Analyse des choix de langue
- **Popularité des œuvres** - Classement des contenus les plus consultés
- **Feedback utilisateur** - Système d'évaluation et commentaires

## 🛠️ Architecture Technique

### Backend - Django REST Framework
- **Framework**: Django 4.2+ avec Django REST Framework
- **Base de données**: PostgreSQL avec support multilingue
- **API**: RESTful endpoints pour toutes les fonctionnalités
- **Authentification**: JWT tokens pour la sécurité
- **Admin**: Interface d'administration Django complète

### Frontend - React Moderne
- **Framework**: React 18+ avec TypeScript
- **Build Tool**: Vite pour des performances optimales
- **Routing**: React Router v6
- **État**: Context API et hooks personnalisés
- **UI**: Composants React avec Tailwind CSS
- **Animations**: Framer Motion pour les transitions fluides

### Outils de Développement
- **Docker**: Containerisation pour le déploiement
- **Git**: Contrôle de version
- **ESLint**: Linting pour la qualité du code
- **Prettier**: Formatage automatique du code

## 🚀 Installation Rapide

### Prérequis
- Docker et Docker Compose
- Python 3.11+
- Node.js 18+

### Méthode 1: Script de Démarrage Automatique (Recommandé)
```bash
# Cloner le dépôt
git clone <repository-url>
cd museum-digital-experience

# Lancer l'application
./start.sh
```

### Méthode 2: Installation Manuelle

#### Backend Django
```bash
# Installer les dépendances Python
cd backend
pip install -r requirements.txt

# Configurer la base de données
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur de développement
python manage.py runserver
```

#### Frontend React
```bash
# Installer les dépendances Node.js
cd frontend
npm install

# Lancer le serveur de développement
npm run dev
```

### Méthode 3: Docker Compose
```bash
# Construire et lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## 📁 Structure du Projet

```
museum-digital-experience/
├── backend/                    # Application Django
│   ├── museum_api/            # Configuration Django
│   ├── artifacts/             # App principale pour les œuvres
│   ├── media/                 # Fichiers multimédia
│   ├── manage.py              # Script de gestion Django
│   ├── requirements.txt       # Dépendances Python
│   └── Dockerfile             # Container backend
├── frontend/                  # Application React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── pages/            # Pages principales
│   │   ├── hooks/            # Hooks personnalisés
│   │   ├── services/         # Services API
│   │   ├── context/          # Contextes React
│   │   └── styles/           # Styles CSS
│   ├── package.json          # Dépendances Node.js
│   ├── vite.config.js        # Configuration Vite
│   └── Dockerfile            # Container frontend
├── data/                     # Données de démonstration
├── docs/                     # Documentation
├── docker-compose.yml        # Configuration Docker
├── nginx.conf               # Configuration Nginx
├── start.sh                 # Script de démarrage
└── README.md                # Documentation
```

## 🌐 Accès à l'Application

Une fois l'application lancée :

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **Documentation API**: http://localhost:8000/api/docs

## 📱 Utilisation

### Pour les Visiteurs
1. **Navigation** : Utilisez le menu principal pour accéder aux différentes sections
2. **Recherche** : Trouvez des œuvres spécifiques avec la fonction de recherche avancée
3. **Scan QR** : Scannez les codes QR sur les œuvres pour accéder aux informations détaillées
4. **Audio Guides** : Écoutez les descriptions audio dans votre langue préférée
5. **Visite Virtuelle** : Explorez le musée virtuellement avec notre parcours guidé

### Pour les Administrateurs
1. **Gestion des Contenus** : Accédez au panneau d'administration Django
2. **Ajout d'Œuvres** : Créez et modifiez les fiches des œuvres
3. **Multimédia** : Uploadez des images, audio et vidéos
4. **QR Codes** : Générez automatiquement les codes QR pour chaque œuvre
5. **Analytics** : Consultez les statistiques de visite et d'engagement

## 🎨 Personnalisation

### Thèmes et Couleurs
L'application utilise une palette de couleurs inspirée des arts africains :
- **Couleurs principales**: Ambre, Orange, Rouge
- **Couleurs secondaires**: Bleu, Violet, Vert, Rose
- **Thème**: Mode clair avec support du mode sombre

### Langues
Support complet pour :
- 🇫🇷 Français (langue principale)
- 🇬🇧 English
- 🇸🇳 Wolof

### Contenus Multimédia
- **Images**: Support des formats JPEG, PNG, WebP
- **Audio**: MP3, WAV, M4A pour les guides audio
- **Vidéo**: MP4, WebM, OGG pour les contenus éducatifs

## 🔧 Configuration

### Variables d'Environnement
```bash
# Backend
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=museum_db
DB_USER=museum_user
DB_PASSWORD=museum_password
DB_HOST=localhost
DB_PORT=5432

# Frontend
VITE_API_URL=http://localhost:8000/api
```

### Base de Données
L'application utilise PostgreSQL avec les extensions suivantes :
- PostGIS pour les données géospatiales
- pg_trgm pour la recherche plein texte
- Unaccent pour la recherche sans accents

## 📊 API Endpoints

### Principales Routes
- `GET /api/artifacts/` - Liste des œuvres
- `GET /api/artifacts/{id}/` - Détails d'une œuvre
- `GET /api/collections/` - Liste des collections
- `GET /api/search/` - Recherche avancée
- `POST /api/qr-scan/` - Scan de code QR
- `GET /api/stats/dashboard/` - Statistiques

### Authentification
- JWT tokens pour l'API
- Session-based pour l'admin Django

## 🧪 Tests

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Déploiement

### Production
1. **Configuration** : Modifier les variables d'environnement
2. **Build** : Construire les images Docker de production
3. **Base de données** : Migrer vers PostgreSQL en production
4. **Static files** : Configurer le serveur de fichiers statiques
5. **HTTPS** : Activer SSL/TLS
6. **Monitoring** : Configurer les outils de surveillance

### Environnements Supportés
- **Local** : Docker Compose
- **Cloud** : AWS, Google Cloud, Azure
- **PaaS** : Heroku, Railway, Render
- **VPS** : DigitalOcean, Linode

## 📈 Performance

### Optimisations Implémentées
- **Images** : Compression et lazy loading
- **Caching** : Cache HTTP et Redis
- **CDN** : Distribution de contenu global
- **Compression** : Gzip/Brotli
- **Minification** : CSS et JavaScript

### Métriques
- **Temps de chargement** : < 3 secondes
- **Performance** : Score Lighthouse > 90
- **Accessibilité** : Conforme WCAG 2.1 AA
- **SEO** : Optimisé pour les moteurs de recherche

## 🔒 Sécurité

### Mesures de Sécurité
- **HTTPS** : Chiffrement TLS partout
- **CORS** : Protection contre les attaques cross-origin
- **Rate limiting** : Limitation des requêtes
- **Input validation** : Validation des données utilisateur
- **SQL injection** : Protection par ORM Django
- **XSS protection** : Sanitization des entrées

## 🤝 Contribution

### Guide de Contribution
1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Poussez vers la branche
5. Créez une Pull Request

### Code de Conduite
- Respect et inclusion
- Collaboration constructive
- Qualité du code
- Documentation claire

## 📄 Licence

Ce projet est développé pour le **Dakar Slush'D 2025** - Hackathon Musée des Civilisations Noires.

© 2025 Musée des Civilisations Noires. Tous droits réservés.

## 🙏 Remerciements

- **Musée des Civilisations Noires** pour l'opportunité
- **Senstartup** pour l'organisation du hackathon
- **Dakar Slush'D 2025** pour la plateforme
- **Communauté Open Source** pour les outils utilisés

## 📞 Support

Pour toute question ou problème :
- Email: support@museecivilisationsnoires.sn
- Documentation: /docs
- Issues: GitHub Issues

---

**Développé avec ❤️ pour la préservation du patrimoine culturel africain**