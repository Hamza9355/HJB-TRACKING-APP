# 🚀 HJB Tracking System - Version 2.0 Moderne

## ✨ Nouvelles Fonctionnalités

### 1. **Système d'Authentification Complet**
- ✅ Inscription avec vérification email
- ✅ Vérification SMS/WhatsApp avec Twilio
- ✅ Connexion sécurisée avec JWT
- ✅ Gestion du profil utilisateur
- ✅ Préférences de notifications

### 2. **Chatbot IA Intelligent**
- 🤖 Assistant conversationnel en temps réel
- 💡 Suggestions intelligentes basées sur le contexte
- 📊 Génération d'insights automatiques
- 🎯 Analyse des performances
- 📈 Recommandations d'optimisation

### 3. **Design Moderne avec Bootstrap 5**
- 📱 Interface responsive et fluide
- 🎨 Gradient époustouflant
- ⚡ Animations fluides et transitions
- 🌙 Support du mode sombre
- 📊 Composants modernes et intuitifs

### 4. **Intégration Cartes**
- 🗺️ Google Maps pour le suivi en temps réel
- 🛣️ Intégration Waze
- 📍 Traçage des itinéraires
- 🎯 Points de chargement/livraison

### 5. **Fonctionnalités Principales**
- 📊 Dashboard avec KPIs
- 🚛 Gestion complète des véhicules
- 📦 Suivi des sessions de chargement
- ⏱️ Monitoring temps réel
- 📈 Rapports détaillés
- 💬 Support par chat IA

---

## 🛠️ Configuration Requise

### Backend
```bash
cd backend
npm install
# Configurer .env avec:
# - MongoDB URI
# - Twilio credentials
# - Email configuration
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Variables d'Environnement (.env)

### Backend
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tracking_db
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Twilio (WhatsApp/SMS)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Email (Gmail/Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 📱 Routes et Accès

### Frontend
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard (nécessite auth)
- **Véhicules**: http://localhost:3000/vehicles
- **Sessions**: http://localhost:3000/sessions
- **Temps Réel**: http://localhost:3000/realtime
- **Rapports**: http://localhost:3000/reports
- **Chatbot IA**: http://localhost:3000/chatbot

### Backend APIs
- **Health**: http://localhost:5000/api/health
- **Auth**: http://localhost:5000/api/auth/
- **Vehicles**: http://localhost:5000/api/vehicles/
- **Sessions**: http://localhost:5000/api/sessions/
- **Chatbot**: http://localhost:5000/api/chatbot/

---

## 🎯 Flux d'Utilisation

1. **Inscription**: Créer un compte avec email et téléphone
2. **Vérification**: Confirmer via email et WhatsApp
3. **Dashboard**: Voir vue d'ensemble et KPIs
4. **Gestion**: Créer véhicules et sessions
5. **Monitoring**: Suivi en temps réel sur la carte
6. **Chatbot**: Poser des questions à l'IA
7. **Rapports**: Générer et exporter les rapports

---

## 🚀 Lancement Rapide

### Windows (PowerShell)
```powershell
# Terminal 1 - Backend
cd c:\Users\HP\Downloads\tracking-app\backend
node server.js

# Terminal 2 - Frontend
cd c:\Users\HP\Downloads\tracking-app\frontend
npm start
```

### Linux/Mac
```bash
# Terminal 1 - Backend
cd tracking-app/backend
npm install && npm start

# Terminal 2 - Frontend
cd tracking-app/frontend
npm install && npm start
```

---

## 📚 Documentation API

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/verify-phone
GET /api/auth/profile
PUT /api/auth/profile
```

### Vehicles
```bash
GET /api/vehicles
POST /api/vehicles
GET /api/vehicles/:id
PUT /api/vehicles/:id
DELETE /api/vehicles/:id
```

### Sessions
```bash
GET /api/sessions
POST /api/sessions
GET /api/sessions/:id
PUT /api/sessions/:id/add-cycle
PUT /api/sessions/:id/record-departure
PUT /api/sessions/:id/record-arrival
```

### Chatbot
```bash
POST /api/chatbot/chat
POST /api/chatbot/insights
GET /api/chatbot/info
```

---

## 🎨 Technologie Stack

### Frontend
- React 18.2
- Bootstrap 5
- React Bootstrap
- Axios
- Socket.io Client
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- Twilio SDK
- Nodemailer
- JWT
- Helmet
- CORS

---

## 🔒 Sécurité

- ✅ JWT authentification
- ✅ Password hashing avec bcryptjs
- ✅ Validation d'entrée
- ✅ Helmet pour sécurité HTTP
- ✅ CORS configuré
- ✅ Verification email/SMS

---

## 📞 Support

Pour toute question ou problème:
1. Consultez le ChatBot IA 🤖
2. Vérifiez les logs du serveur
3. Consultez la documentation
4. Ouvrez une issue sur le projet

---

## 📄 Licence

HJB Tracking System © 2025 - Tous droits réservés

**Version**: 2.0
**Dernière mise à jour**: 17 Janvier 2026
