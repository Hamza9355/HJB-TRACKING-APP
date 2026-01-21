# Guide de Démarrage Rapide - HJB Tracking System

## ⚡ Démarrage en 5 minutes

### 1. Prérequis
- Node.js installé
- MongoDB local ou MongoDB Atlas (cloud)
- Terminal/PowerShell

### 2. Backend Setup

```powershell
# Naviguer au dossier backend
cd backend

# Installer les dépendances
npm install

# Vérifier le fichier .env (déjà configuré)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/tracking_db

# Démarrer le serveur
npm start

# Ou en mode développement (avec hot reload)
npm run dev
```

**✅ Backend en écoute sur:** `http://localhost:5000`

### 3. Seed la Base de Données (Optionnel)

```powershell
# Dans un autre terminal
cd backend
node data/seed.js
```

Cela créera 7 véhicules et 15 sessions d'exemple.

### 4. Frontend Setup

```powershell
# Naviguer au dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

**✅ Frontend accessible sur:** `http://localhost:3000`

## 🎯 Utilisation Basique

### Première Visite
1. Ouvrir `http://localhost:3000`
2. Accès direct au Dashboard
3. Voir les statistiques si les données seed sont chargées

### Créer un Véhicule
1. Menu → Véhicules
2. Bouton "Ajouter Véhicule"
3. Remplir le formulaire
4. Sauvegarder

### Créer une Session
1. Menu → Sessions
2. Bouton "Nouvelle Session"
3. Sélectionner une pelleteuse et un camion
4. Ajouter des cycles
5. Enregistrer départ/arrivée

### Voir en Temps Réel
1. Menu → Temps Réel
2. Voyez les événements WebSocket en live

## 🔧 Configuration MongoDB

### Option 1: MongoDB Local
```bash
# Installer MongoDB Community
# https://www.mongodb.com/try/download/community

# Démarrer le service
# Windows: mongod
# Linux/Mac: brew services start mongodb-community

# Vérifier la connexion
mongosh
```

### Option 2: MongoDB Atlas (Cloud)
1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Mettre à jour `.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tracking_db
```

## 📊 Données de Test

Après seed, vous avez:
- **Pelleteuses**: PEL-001, PEL-002, PEL-003
- **Camions**: CAM-001, CAM-002, CAM-003, CAM-004
- **Sessions**: 15 sessions d'exemple avec cycles

## 🌐 Endpoints de Test

```bash
# Vérifier la santé du serveur
curl http://localhost:5000/api/health

# Obtenir tous les véhicules
curl http://localhost:5000/api/vehicles

# Obtenir l'overview du dashboard
curl http://localhost:5000/api/dashboard/overview
```

## ⚠️ Problèmes Courants

### "Cannot connect to MongoDB"
```
Solution:
1. Vérifier que MongoDB est en cours d'exécution
2. Vérifier l'URI dans .env
3. Pour Atlas, vérifier le IP whitelist
```

### "Port 5000 already in use"
```bash
# Utiliser un port différent
set PORT=5001 && npm start  # Windows
PORT=5001 npm start         # Mac/Linux
```

### "WebSocket not connecting"
```
Solution:
1. Vérifier que le backend tourne
2. Vérifier REACT_APP_SOCKET_URL dans frontend/.env
3. Ouvrir console du navigateur (F12) pour voir les erreurs
```

### "Module not found"
```bash
# Réinstaller les dépendances
rm -r node_modules package-lock.json
npm install
```

## 📋 Checklist de Démarrage

- [ ] Node.js installé (`node --version`)
- [ ] MongoDB installé/configuré
- [ ] Backend `.env` configuré
- [ ] Frontend `.env` configuré
- [ ] Backend npm install complété
- [ ] Frontend npm install complété
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 3000)
- [ ] Base de données seedée (optionnel)
- [ ] Application accessible sur localhost:3000

## 🚀 Prochaines Étapes

1. **Explorer le Dashboard**: Voir les statistiques
2. **Ajouter des Véhicules**: Tester CRUD
3. **Créer une Session**: Tester le workflow complet
4. **Monitorer en Temps Réel**: Voir WebSocket en action
5. **Générer des Rapports**: Explorer les rapports

## 📚 Ressources

- **Backend Docs**: `backend/README.md`
- **Frontend Docs**: `frontend/README.md`
- **API Docs**: Voir `README.md` racine

## 💡 Tips

- Utilisez `npm run dev` au backend pour hot reload
- Ouvrez DevTools (F12) pour debug WebSocket
- Les notifications toast s'affichent en haut à droite
- Dark mode activé par défaut

## ❓ Support

En cas de problème:
1. Vérifier les logs du terminal
2. Consulter la console du navigateur (F12)
3. Relire la section Problèmes Courants
4. Vérifier les fichiers `.env`

---

**Prêt à démarrer!** 🎉
