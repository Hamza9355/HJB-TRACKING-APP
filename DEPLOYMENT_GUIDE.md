# 🚀 Guide de Déploiement - HJB Tracking App

## Déploiement Gratuit (0€)

### Architecture
- **Frontend:** Vercel (React)
- **Backend:** Render (Node.js/Express)
- **Base de données:** MongoDB Atlas (Gratuit - 512 MB)

---

## 📋 Étape 1: Configurer MongoDB Atlas (Gratuit)

1. **Créer un compte**
   - Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Inscrivez-vous gratuitement

2. **Créer un cluster gratuit**
   - Cliquez "Create a Deployment"
   - Sélectionnez le plan "Free"
   - Choisissez une région proche
   - Cliquez "Create Cluster"

3. **Créer un utilisateur de base de données**
   - Dans "Database Access", créez un nouvel utilisateur
   - Sauvegardez le username et password
   - Username: `tracking_user` (exemple)
   - Password: `StrongPassword123` (générez un mot de passe fort)

4. **Obtenir la chaîne de connexion**
   - Allez dans "Database Deployments"
   - Cliquez "Connect" sur votre cluster
   - Sélectionnez "Connect your application"
   - Copiez la chaîne : `mongodb+srv://tracking_user:PASSWORD@cluster.mongodb.net/tracking_db`
   - Remplacez:
     - `tracking_user` par votre username
     - `PASSWORD` par votre mot de passe

5. **Ajouter votre IP**
   - Dans "Network Access", cliquez "Add IP Address"
   - Sélectionnez "Allow Access from Anywhere" (0.0.0.0/0)

---

## 🌐 Étape 2: Déployer le Frontend sur Vercel (Gratuit)

1. **Préparer le frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Aller sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Sign up with GitHub"
   - Autorisez Vercel

3. **Créer un nouveau projet**
   - Cliquez "New Project"
   - Sélectionnez votre repository `HJB-TRACKING-APP`
   - Configurez:
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`

4. **Ajouter les variables d'environnement**
   - Cliquez "Environment Variables"
   - Ajoutez:
     ```
     REACT_APP_API_URL=https://votre-backend.onrender.com/api
     REACT_APP_SOCKET_URL=https://votre-backend.onrender.com
     ```

5. **Déployer**
   - Cliquez "Deploy"
   - Attendez la fin du déploiement
   - **Votre URL Vercel:** `https://hjb-tracking-app.vercel.app`

---

## 🔌 Étape 3: Déployer le Backend sur Render (Gratuit)

1. **Préparer le backend**
   ```bash
   cd backend
   npm install
   ```

2. **Aller sur Render**
   - Allez sur [render.com](https://render.com)
   - Cliquez "Sign up with GitHub"
   - Autorisez Render

3. **Créer un Web Service**
   - Cliquez "New +"
   - Sélectionnez "Web Service"
   - Sélectionnez votre repository `HJB-TRACKING-APP`

4. **Configurer le service**
   - **Name:** `hjb-tracking-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

5. **Ajouter les variables d'environnement**
   - Cliquez "Environment"
   - Ajoutez:
     ```
     MONGODB_URI=mongodb+srv://tracking_user:PASSWORD@cluster.mongodb.net/tracking_db
     FRONTEND_URL=https://hjb-tracking-app.vercel.app
     NODE_ENV=production
     ```

6. **Déployer**
   - Cliquez "Create Web Service"
   - Attendez la fin du déploiement
   - **Votre URL Render:** `https://hjb-tracking-api.onrender.com`

---

## ✅ Vérifier le déploiement

### Test du backend
```bash
curl https://hjb-tracking-api.onrender.com/api/health
```

Vous devriez voir:
```json
{
  "status": "OK",
  "message": "Serveur Tracking en ligne",
  "timestamp": "2026-01-21T12:00:00.000Z"
}
```

### Test du frontend
- Allez sur: `https://hjb-tracking-app.vercel.app`
- L'app devrait charger correctement

---

## 🔧 Configuration finales

### Mettre à jour le frontend (.env)
```
REACT_APP_API_URL=https://hjb-tracking-api.onrender.com/api
REACT_APP_SOCKET_URL=https://hjb-tracking-api.onrender.com
```

### Mettre à jour le backend (.env)
```
MONGODB_URI=mongodb+srv://tracking_user:PASSWORD@cluster.mongodb.net/tracking_db
FRONTEND_URL=https://hjb-tracking-app.vercel.app
PORT=5000
NODE_ENV=production
```

---

## 📊 Liens de votre application

- **🌐 Frontend:** https://hjb-tracking-app.vercel.app
- **🔌 Backend API:** https://hjb-tracking-api.onrender.com
- **📁 Données:** MongoDB Atlas

---

## 💡 Notes importantes

1. **Temps de démarrage Render:**
   - Le plan gratuit peut mettre 30-50 secondes au premier démarrage
   - Render endort les services inactifs après 15 minutes
   - Il faudra patienter 30 secondes au prochain accès

2. **Limites gratuites:**
   - MongoDB Atlas: 512 MB de données
   - Vercel: 100 déploiements/mois
   - Render: 750 heures/mois

3. **Mise à jour:**
   - Poussez simplement votre code sur GitHub
   - Vercel et Render se déploient automatiquement

---

## 🐛 Dépannage

### Le backend ne démarre pas
1. Vérifiez les logs sur Render
2. Vérifiez la chaîne MongoDB (username et password)
3. Vérifiez que l'IP a accès à MongoDB Atlas

### Le frontend ne se connecte pas au backend
1. Vérifiez les variables d'environnement `REACT_APP_API_URL`
2. Vérifiez que le backend est accessible
3. Vérifiez la configuration CORS dans `server.js`

### Base de données pleine
- Augmentez le plan MongoDB à partir de $57/mois
- Ou supprimez les anciennes données

---

**C'est tout! Votre app est maintenant en ligne et accessible à tous! 🎉**
