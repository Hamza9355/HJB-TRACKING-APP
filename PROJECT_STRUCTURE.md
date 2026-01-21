# Project Structure - HJB Tracking System

## Complete Project Tree

```
tracking-app/
├── README.md                          # Documentation complète
├── QUICKSTART.md                      # Guide de démarrage rapide
│
├── backend/
│   ├── package.json                   # Dépendances backend
│   ├── .env                           # Configuration (MongoDB, PORT, etc)
│   ├── .gitignore                     # Git ignore
│   ├── server.js                      # Point d'entrée principal
│   │
│   ├── models/
│   │   ├── Vehicle.js                 # Schéma Véhicule (camions/pelleteuses)
│   │   ├── LoadingSession.js          # Schéma Session de chargement
│   │   └── ExcavatorCycle.js          # Schéma Cycle d'excavateur
│   │
│   ├── routes/
│   │   ├── vehicles.js                # Endpoints CRUD véhicules
│   │   ├── sessions.js                # Endpoints sessions et cycles
│   │   ├── cycles.js                  # Endpoints cycles
│   │   └── dashboard.js               # Endpoints dashboard
│   │
│   └── data/
│       └── seed.js                    # Script pour peupler la BD avec données test
│
├── frontend/
│   ├── package.json                   # Dépendances frontend (React, MUI, etc)
│   ├── .env                           # Configuration API et Socket URLs
│   ├── .gitignore                     # Git ignore
│   │
│   ├── public/
│   │   └── index.html                 # HTML template principal
│   │
│   └── src/
│       ├── index.js                   # Point d'entrée React
│       ├── index.css                  # Styles globaux
│       ├── App.js                     # Composant principal avec routing
│       ├── App.css                    # Styles App
│       │
│       ├── context/
│       │   └── SocketContext.js       # Context Socket.io pour temps réel
│       │
│       ├── services/
│       │   └── api.js                 # Service Axios pour requêtes API
│       │
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Layout.js          # Layout principal (Header + Sidebar + Content)
│       │   │   ├── Header.js          # Barre d'en-tête
│       │   │   ├── Sidebar.js         # Barre de navigation latérale
│       │   │   └── Footer.js          # Pied de page
│       │   │
│       │   ├── Common/
│       │   │   ├── LoadingSpinner.js  # Composant spinner
│       │   │   ├── AlertCard.js       # Composant alerte
│       │   │   ├── StatCard.js        # Composant statistique
│       │   │   └── DataTable.js       # Composant tableau générique
│       │   │
│       │   └── Charts/
│       │       ├── DailySessionsChart.js  # Graphique sessions/jour
│       │       └── VehiclesChart.js      # Graphique distribution véhicules
│       │
│       └── pages/
│           ├── Dashboard/
│           │   ├── Dashboard.js       # Page tableau de bord
│           │   └── Dashboard.css      # Styles dashboard
│           │
│           ├── Vehicles/
│           │   ├── Vehicles.js        # Page gestion véhicules
│           │   └── VehicleForm.js     # Formulaire véhicule
│           │
│           ├── Sessions/
│           │   ├── Sessions.js        # Page liste sessions
│           │   └── SessionDetail.js   # Page détail session
│           │
│           ├── RealTime/
│           │   └── RealTime.js        # Page suivi temps réel
│           │
│           └── Reports/
│               └── Reports.js         # Page rapports
```

## Statistics

- **Total Files**: 40+
- **Backend Files**: 13
- **Frontend Components**: 22+
- **Configuration Files**: 4
- **Documentation Files**: 3

## Key Features

### Backend
✅ API RESTful complète (CRUD)
✅ WebSocket pour temps réel
✅ Mongoose pour MongoDB
✅ Validation des données
✅ Gestion d'erreurs globale
✅ CORS configuré
✅ Helmet pour sécurité

### Frontend
✅ React 18 avec Hooks
✅ React Router pour navigation
✅ Material-UI pour UI
✅ Axios pour requêtes API
✅ Socket.io Client pour temps réel
✅ Charts.js pour graphiques
✅ React Hot Toast pour notifications
✅ Dark theme professionnel

## Installation

See `QUICKSTART.md` for quick start instructions.

See `README.md` for detailed documentation.

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- Helmet, CORS, Morgan

### Frontend
- React 18
- React Router v6
- Material-UI v5
- Axios
- Socket.io-client
- Chart.js
- React Hot Toast

## Deployment Ready

The application is ready for deployment with:
- Environment variables configuration
- Error handling
- Security headers
- CORS configuration
- Production-ready dependencies

## Database Schema

### Vehicle
- type (CAMION, PELLETEUSE)
- registration_number (unique)
- model, capacity, manufacturer, year
- status (ACTIF, MAINTENANCE, HORS_SERVICE)
- location (GPS coordinates)

### LoadingSession
- excavator_id, truck_id (references)
- timestamps (start, end, departure, arrival)
- weights (excavator, truck start, truck arrival)
- alert_status (OK, WARNING_LOAD, WARNING_THEFT, EN_COURS)
- operator_name, destination, notes

### ExcavatorCycle
- session_id (reference)
- bucket_weight, travel_distance
- material_type (GRAVIER, SABLE, TERRE, PIERRES, AUTRE)
- sensor_status (OK, ERREUR, CALIBRATION)
- GPS data (start, end coordinates)

---

**Project created:** 2024
**Version:** 1.0.0
