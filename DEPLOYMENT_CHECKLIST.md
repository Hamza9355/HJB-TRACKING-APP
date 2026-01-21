# 📋 Checklist de Déploiement - HJB Tracking App

## Phase 1: Préparation

- [ ] Vous avez un compte GitHub avec le repo `HJB-TRACKING-APP`
- [ ] Vous avez une adresse email valide
- [ ] Vous êtes prêt à créer des comptes gratuits

---

## Phase 2: MongoDB Atlas (5 minutes)

- [ ] Aller sur: https://mongodb.com/cloud/atlas
- [ ] Créer un compte gratuit
- [ ] Créer un cluster gratuit
- [ ] Créer un utilisateur BD (username + password)
- [ ] Copier la chaîne de connexion
  ```
  mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/tracking_db
  ```
- [ ] Ajouter IP whitelist: `0.0.0.0/0`

**Chaîne de connexion MongoDB:**
```
Sauvegardez-la ici: _______________________________
```

---

## Phase 3: Vercel (Frontend) - 3 minutes

- [ ] Aller sur: https://vercel.com
- [ ] Sign up with GitHub
- [ ] Créer New Project
- [ ] Sélectionner repo: `HJB-TRACKING-APP`
- [ ] Configurer:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `build`
- [ ] Ajouter variable env:
  - Clé: `REACT_APP_API_URL`
  - Valeur: `https://hjb-tracking-api.onrender.com/api` (à remplir après Render)
- [ ] Cliquer "Deploy"
- [ ] Attendre la fin (2-3 min)

**URL Vercel obtenu:**
```
https://________________________________.vercel.app
```

---

## Phase 4: Render (Backend) - 3 minutes

- [ ] Aller sur: https://render.com
- [ ] Sign up with GitHub
- [ ] Créer New Web Service
- [ ] Sélectionner repo: `HJB-TRACKING-APP`
- [ ] Configurer:
  - Name: `hjb-tracking-api`
  - Root Directory: `backend`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Plan: `Free`
- [ ] Ajouter variables env:
  ```
  MONGODB_URI = mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/tracking_db
  FRONTEND_URL = https://YOUR-VERCEL-URL.vercel.app
  NODE_ENV = production
  ```
- [ ] Cliquer "Create Web Service"
- [ ] Attendre le déploiement (3-5 min)

**URL Render obtenu:**
```
https://________________________________.onrender.com
```

---

## Phase 5: Mise à jour des URLs

- [ ] **Vercel:** Ajouter variable env `REACT_APP_API_URL`
  - Valeur: `https://YOUR-RENDER-URL.onrender.com/api`
- [ ] **Render:** Vérifier variable env `FRONTEND_URL`
  - Valeur: `https://YOUR-VERCEL-URL.vercel.app`

---

## Phase 6: Vérification (5 minutes)

### Test 1: Backend Health Check
```bash
curl https://YOUR-RENDER-URL.onrender.com/api/health
```

Vous devriez voir:
```json
{
  "status": "OK",
  "message": "Serveur Tracking en ligne",
  "timestamp": "2026-01-21T..."
}
```

- [ ] Backend répond ✅

### Test 2: Frontend accessible
```
Allez sur: https://YOUR-VERCEL-URL.vercel.app
```

- [ ] Frontend charge ✅
- [ ] Page ne montre pas d'erreur ✅

### Test 3: Connexion API
- [ ] Login fonctionne (si applicable) ✅
- [ ] Les données chargent ✅

---

## 🎉 Déploiement Complété!

### Résumé Final

| Service | URL | Statut |
|---------|-----|--------|
| Frontend | https://YOUR-VERCEL-URL.vercel.app | ✅ |
| Backend | https://YOUR-RENDER-URL.onrender.com | ✅ |
| Database | MongoDB Atlas | ✅ |

### Liens à sauvegarder

```
🌐 Frontend:   https://____________________________________
🔌 Backend:    https://____________________________________
💾 MongoDB:    mongodb+srv://____________________________
👤 Username:   _________________________
🔐 Password:   _________________________
```

---

## 📝 Notes Importantes

### Comportement normal (Ne pas s'inquiéter!)

- ⏱️ Premier accès Render peut prendre 30-50 secondes (Wake-up)
- 😴 Render endort les services gratuits après 15 min d'inactivité
- 🔄 Chaque git push = redéploiement automatique
- 📊 MongoDB gratuit limité à 512 MB

### En cas de problème

1. Vérifiez les logs:
   - Vercel: Dans le dashboard project
   - Render: Dans les deployment logs

2. Vérifiez les variables d'env:
   - Corriger et redéployer
   - Render se redéploiera auto

3. Vérifiez MongoDB:
   - Connexion correcte?
   - IP whitelist correct?

---

## 🚀 Prochaines étapes (Optionnel)

- [ ] Configurer les notifications
- [ ] Ajouter un domaine custom (à partir de $12/mois)
- [ ] Configurer CI/CD avancé
- [ ] Monitorer les performances
- [ ] Ajouter des backups

---

## 📞 Support

**Si quelque chose ne fonctionne pas:**

1. Vérifiez `DEPLOYMENT_GUIDE.md` → Section Dépannage
2. Consultez les logs de déploiement
3. Vérifiez les variables d'environnement
4. Testez avec `curl` depuis le terminal

---

**Félicitations! Votre app est en ligne! 🎊**

*Partagez le lien: https://YOUR-VERCEL-URL.vercel.app*

