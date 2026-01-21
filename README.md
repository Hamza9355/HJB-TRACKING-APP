# HJB Tracking System - Application Complète de Suivi de Chargement

## 📋 Description

HJB Tracking System est une application web complète de suivi et gestion du chargement de matériaux. Elle permet de:
- Gérer une flotte de véhicules (camions et pelleteuses)
- Enregistrer et suivre les sessions de chargement
- Monitorer les cycles d'excavateur
- Déterminer les anomalies et alertes
- Visualiser les données en temps réel via WebSocket
- Générer des rapports détaillés

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── models/           # Schémas MongoDB
├── routes/           # Endpoints API
├── data/             # Seed data
├── .env              # Variables d'environnement
├── server.js         # Point d'entrée
└── package.json      # Dépendances
```

**Modèles:**
- `Vehicle`: Gestion des camions et pelleteuses
- `LoadingSession`: Sessions de chargement
- `ExcavatorCycle`: Cycles d'excavateur

**Routes API:**
- `/api/vehicles` - CRUD véhicules
- `/api/sessions` - Gestion des sessions
- `/api/cycles` - Cycles d'excavateur
- `/api/dashboard` - Données du tableau de bord

### Frontend (React + Material-UI)
```
frontend/
├── src/
│   ├── context/      # Socket.io context
│   ├── services/     # Appels API Axios
│   ├── components/   # Composants réutilisables
│   ├── pages/        # Pages principales
│   ├── App.js        # Routing principal
│   └── index.js      # Point d'entrée
└── package.json      # Dépendances
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js v14+
- MongoDB (local ou Atlas)
- npm ou yarn

### Backend

1. **Installer les dépendances:**
```bash
cd backend
npm install
```

2. **Configurer MongoDB dans `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tracking_db
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. **Seed la base de données (optionnel):**
```bash
node data/seed.js
```

4. **Démarrer le serveur:**
```bash
npm start          # Production
npm run dev        # Développement (avec nodemon)
```

Le serveur écoute sur `http://localhost:5000`

### Frontend

1. **Installer les dépendances:**
```bash
cd frontend
npm install
```

2. **Configurer dans `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

3. **Démarrer l'application:**
```bash
npm start
```

L'application est accessible sur `http://localhost:3000`

## 📊 Fonctionnalités

### Dashboard
- Statistiques en temps réel
- Graphiques de sessions par jour
- Distribution des véhicules
- Alertes récentes

### Gestion des Véhicules
- Liste complète des véhicules
- Ajouter/modifier/supprimer véhicules
- Filtrer par type et statut
- Informations détaillées

### Sessions de Chargement
- Créer et gérer les sessions
- Ajouter des cycles d'excavateur
- Enregistrer départ et arrivée
- Suivi du poids et des anomalies
- Historique complète

### Temps Réel
- Connexion WebSocket active
- Mises à jour en direct
- Indicateur de connexion
- Statistiques en live

### Rapports
- Rapports journaliers
- Rapports mensuels
- Rapports d'alertes
- Export PDF/Excel

## 🔌 WebSocket (Socket.io)

Les événements temps réel:
```javascript
// Client émet
socket.emit('join-session', sessionId)

// Client reçoit
socket.on('session-started', (session) => {})
socket.on('session-update', (session) => {})
socket.on('cycle-added', (data) => {})
socket.on('session-completed', (session) => {})
socket.on('vehicle-added', (vehicle) => {})
socket.on('vehicle-updated', (vehicle) => {})
socket.on('vehicle-deleted', (vehicleId) => {})
```

## 🎨 Design

- **Thème**: Dark mode professionnel
- **Couleurs principales**: Bleu profond (#1a237e), Orange (#ff9800)
- **UI Framework**: Material-UI 5
- **Responsive**: Mobile-first design

## 📈 Données Exemple

Le script `seed.js` crée:
- 3 pelleteuses (PELLETEUSE)
- 4 camions (CAMION)
- 15 sessions de chargement
- Cycles d'excavateur pour chaque session

## 🔒 Sécurité

- CORS configuré
- Helmet pour les en-têtes HTTP
- Validation des entrées
- Gestion d'erreurs globale

## 📦 Dépendances Clés

### Backend
- `express`: Framework web
- `mongoose`: ODM MongoDB
- `socket.io`: Communication temps réel
- `cors`: Cross-Origin Resource Sharing
- `helmet`: Sécurité HTTP

### Frontend
- `react`: Interface utilisateur
- `react-router-dom`: Routage
- `@mui/material`: Composants UI
- `axios`: Client HTTP
- `socket.io-client`: Client WebSocket
- `chart.js`: Graphiques
- `react-hot-toast`: Notifications

## 🛠️ Développement

### Variables d'environnement Backend
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tracking_db
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Variables d'environnement Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📱 Routes de l'Application

| Chemin | Description |
|--------|-------------|
| `/dashboard` | Tableau de bord principal |
| `/vehicles` | Gestion des véhicules |
| `/sessions` | Liste des sessions |
| `/sessions/:id` | Détail d'une session |
| `/realtime` | Suivi en temps réel |
| `/reports` | Rapports |

## 🐛 Troubleshooting

### Connection MongoDB
```bash
# Vérifier que MongoDB est en cours d'exécution
mongosh
```

### Port déjà utilisé
```bash
# Backend sur port différent
PORT=5001 npm start

# Frontend sur port différent
PORT=3001 npm start
```

### WebSocket non connecté
- Vérifier que le backend est en cours d'exécution
- Vérifier REACT_APP_SOCKET_URL dans .env
- Vérifier les logs du navigateur (console)

## 📝 Structure des Endpoints API

### Véhicules
- `GET /api/vehicles` - Lister tous
- `GET /api/vehicles/:id` - Détails
- `POST /api/vehicles` - Créer
- `PUT /api/vehicles/:id` - Modifier
- `DELETE /api/vehicles/:id` - Supprimer
- `GET /api/vehicles/stats/summary` - Statistiques

### Sessions
- `GET /api/sessions` - Lister (avec pagination)
- `GET /api/sessions/:id` - Détails avec cycles
- `POST /api/sessions` - Créer session
- `PUT /api/sessions/:id/add-cycle` - Ajouter cycle
- `PUT /api/sessions/:id/record-departure` - Départ
- `PUT /api/sessions/:id/record-arrival` - Arrivée
- `GET /api/sessions/stats/daily` - Stats du jour

### Cycles
- `GET /api/cycles/session/:sessionId` - Cycles d'une session

### Dashboard
- `GET /api/dashboard/overview` - Vue d'ensemble

## 📄 Licence

Ce projet est propriété de HJB Technologie.

## 👨‍💼 Support

Pour toute question ou problème, contactez le support HJB Technologie.

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2024
