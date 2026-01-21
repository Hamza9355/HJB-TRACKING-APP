# 🚀 Commandes Rapides - HJB Tracking System

## Terminal 1: Backend

```bash
# Accéder au dossier
cd backend

# Installer les dépendances
npm install

# Démarrer le serveur (production)
npm start

# Démarrer en développement (avec hot reload)
npm run dev

# Peupler la base de données
node data/seed.js
```

## Terminal 2: Frontend

```bash
# Accéder au dossier
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm start

# Builder pour production
npm run build

# Tests (si configurés)
npm test
```

---

## Accès aux URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | `http://localhost:3000` | Application React |
| Backend API | `http://localhost:5000/api` | API REST |
| Health Check | `http://localhost:5000/api/health` | Santé du serveur |

---

## Endpoints Rapides (curl/PowerShell)

```powershell
# Vérifier la connexion
curl http://localhost:5000/api/health

# Lister tous les véhicules
curl http://localhost:5000/api/vehicles

# Lister les sessions (page 1)
curl "http://localhost:5000/api/sessions?page=1&limit=10"

# Dashboard overview
curl http://localhost:5000/api/dashboard/overview
```

---

## MongoDB

### Si local:
```bash
# Vérifier MongoDB
mongosh

# Voir les bases
show dbs

# Voir les collections
use tracking_db
show collections

# Compter les véhicules
db.vehicles.countDocuments()
```

### Si Atlas (Cloud):
1. Aller sur mongodb.com/cloud/atlas
2. Se connecter au cluster
3. Utiliser MongoDB Compass ou mongosh avec connection string

---

## Troubleshooting Rapide

```bash
# Backend plante?
# 1. Vérifier MongoDB
mongosh

# 2. Vérifier le port
netstat -ano | findstr 5000  # Windows

# 3. Réinstaller les dépendances
cd backend
rm -r node_modules package-lock.json
npm install

# Frontend ne se charge pas?
# 1. Vérifier si backend tourne
curl http://localhost:5000/api/health

# 2. Vérifier le port
netstat -ano | findstr 3000  # Windows

# 3. Réinstaller les dépendances
cd frontend
rm -r node_modules package-lock.json
npm install
```

---

## Configuration Fichiers

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tracking_db
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## Tests Manuels

### Créer un Véhicule via API

```powershell
$body = @{
    type = "PELLETEUSE"
    registration_number = "TEST-001"
    model = "CAT 320"
    capacity = 18000
    manufacturer = "Caterpillar"
    status = "ACTIF"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/vehicles `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Créer une Session

```powershell
$body = @{
    excavator_id = "VEHICLE_ID_HERE"
    truck_id = "TRUCK_ID_HERE"
    operator_name = "Test Operator"
    destination = "Test Site"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/sessions `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## Logs & Debug

```bash
# Backend logs
# Ils s'affichent directement dans le terminal

# Frontend logs
# Ouvrir DevTools: F12 ou Ctrl+Shift+I
# Aller dans Console
# Voir aussi Network pour les requêtes API
# Voir Application > WebSocket pour Socket.io

# MongoDB logs
mongosh
db.adminCommand({getLog: 'global'})
```

---

## Arrêter les Services

```bash
# Backend: Ctrl+C dans le terminal

# Frontend: Ctrl+C dans le terminal

# MongoDB (si local):
# Windows: mongod arrête tout
# Mac/Linux: brew services stop mongodb-community
```

---

## Redémarrer Tout

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 (optionnel) - Logs mongosh
mongosh
```

---

## Voir les Logs

```bash
# Backend logs (terminal)
# Affichés automatiquement avec morgan

# Frontend logs (console du navigateur)
F12 -> Console tab

# Base de données
mongosh
db.vehicles.find()
db.loadingsessions.find()
```

---

## Rechercher dans le Code

```bash
# Rechercher un mot-clé
grep -r "socket" backend/
grep -r "useState" frontend/src/

# Windows PowerShell
Select-String -r "socket" backend/
Select-String -r "useState" frontend/src/
```

---

## Statistiques du Projet

```bash
# Compter les fichiers
# Backend
find backend -type f | wc -l

# Frontend
find frontend/src -type f | wc -l

# Total du code
wc -l backend/**/*.js
wc -l frontend/src/**/*.js
```

---

## Production Quick Deploy

### Heroku Backend
```bash
heroku login
heroku create tracking-app-backend
heroku config:set MONGODB_URI=...
git push heroku main
```

### Vercel Frontend
```bash
npm install -g vercel
vercel
```

---

## Checklist Démarrage

- [ ] `cd backend && npm install`
- [ ] `cd frontend && npm install`
- [ ] Vérifier `.env` dans backend
- [ ] Vérifier `.env` dans frontend
- [ ] `npm start` dans backend
- [ ] `npm start` dans frontend
- [ ] Accéder `http://localhost:3000`
- [ ] Tester quelques pages
- [ ] (Optionnel) `node data/seed.js`

---

## Aide Rapide

| Besoin | Action |
|--------|--------|
| Documentation | Lire `README.md` |
| Démarrer vite | Suivre `QUICKSTART.md` |
| Déployer | Voir `DEPLOYMENT.md` |
| Structure | Lire `PROJECT_STRUCTURE.md` |
| Port occupé | `lsof -i :5000` ou `lsof -i :3000` |
| Nettoyer cache | `npm cache clean --force` |
| Vérifier Node | `node --version` |
| Vérifier npm | `npm --version` |

---

## Ressources Utiles

- React docs: https://react.dev
- Material-UI: https://mui.com
- Express: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Socket.io: https://socket.io/docs

---

**Besoin d'aide?** Consultez les fichiers de documentation!
