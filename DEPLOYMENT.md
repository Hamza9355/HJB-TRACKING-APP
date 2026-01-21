# Guide de Déploiement - HJB Tracking System

## 🚀 Déploiement en Production

### Prérequis de Production
- Node.js v14+
- MongoDB Atlas (cloud) ou serveur MongoDB dédié
- Certificats SSL/TLS
- Domaine personnalisé (optionnel)

---

## Backend Deployment

### Option 1: Heroku

1. **Créer un compte** sur https://www.heroku.com

2. **Installer Heroku CLI** et se connecter:
```bash
heroku login
heroku create your-app-name
```

3. **Configurer les variables d'environnement**:
```bash
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tracking_db
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

4. **Déployer**:
```bash
git push heroku main
```

### Option 2: AWS EC2 + EB

1. **Installer EB CLI**:
```bash
pip install awsebcli --upgrade --user
```

2. **Initialiser et déployer**:
```bash
cd backend
eb init -p "Node.js 16 running on 64bit Amazon Linux 2"
eb create tracking-backend
eb setenv MONGODB_URI=mongodb+srv://... NODE_ENV=production
eb deploy
```

### Option 3: DigitalOcean

1. **Créer un droplet** Ubuntu
2. **Installer Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Cloner le repo** et installer:
```bash
git clone <your-repo>
cd tracking-app/backend
npm install
```

4. **Utiliser PM2** pour la gestion des processus:
```bash
npm install -g pm2
pm2 start server.js --name tracking-backend
pm2 startup
pm2 save
```

5. **Configurer Nginx**:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Frontend Deployment

### Option 1: Vercel

1. **Push sur GitHub**
2. **Connecter Vercel** à votre repo
3. **Déployer automatiquement**:
   - Vercel construit automatiquement le projet
   - Variables d'environnement à configurer dans Vercel dashboard

### Option 2: Netlify

1. **Build local**:
```bash
cd frontend
npm run build
```

2. **Déployer via Netlify CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

3. **Ou déployer via GitHub**:
   - Connecter Vercel/Netlify à votre repo GitHub
   - Déploiement automatique à chaque push

### Option 3: AWS S3 + CloudFront

1. **Build du projet**:
```bash
npm run build
```

2. **Déployer sur S3**:
```bash
aws s3 sync build/ s3://your-bucket-name
```

3. **Configurer CloudFront** pour HTTPS

---

## Configuration Production

### Backend `.env` Production
```env
# Security
NODE_ENV=production
JWT_SECRET=your-very-secure-random-secret-key-here

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tracking_db_prod

# Server
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Logging (optionnel)
LOG_LEVEL=info
```

### Frontend `.env` Production
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

---

## SSL/HTTPS Configuration

### Avec Let's Encrypt (gratuit)

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtenir certificat
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renouvellement
sudo systemctl enable certbot.timer
```

### Nginx avec SSL
```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

---

## Monitoring et Logs

### PM2 Monitoring
```bash
# Dashboard PM2
pm2 monit

# Logs
pm2 logs tracking-backend

# Restart on crash
pm2 restart tracking-backend
```

### Avec Papertrail (logs centralisés)
```bash
npm install winston
```

### Alertes Email
```bash
pm2 install pm2-auto-pull
pm2 install pm2-logrotate
```

---

## Database Migration

### Backup MongoDB
```bash
# Local
mongodump --uri "mongodb://localhost:27017/tracking_db" --out ./backup

# Atlas
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/tracking_db"
```

### Restore MongoDB
```bash
mongorestore --uri "mongodb+srv://..." ./backup
```

---

## Performance Optimization

### Backend
```javascript
// Compression
const compression = require('compression');
app.use(compression());

// Cache headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Frontend
```bash
# Build optimisé
npm run build

# Compression gzip
gzip -9 build/index.html
```

---

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test
      - run: npm run build

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm install && npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: frontend/build
```

---

## Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] MongoDB Atlas configuré
- [ ] Certificat SSL/HTTPS obtenu
- [ ] Domaine pointé vers serveur
- [ ] Backend testé en production
- [ ] Frontend construit (`npm run build`)
- [ ] CORS configuré correctement
- [ ] WebSocket testés
- [ ] Logs centralisés configurés
- [ ] Backups automatiques programmés
- [ ] Monitoring activé
- [ ] Alertes configurées

---

## Troubleshooting Production

### Erreur: "Cannot connect to MongoDB"
```bash
# Vérifier la connection string
# Vérifier IP whitelist sur Atlas
# Vérifier username/password
```

### WebSocket ne fonctionne pas
```nginx
# Ajouter à Nginx:
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
```

### Lent ou timeout
```bash
# Augmenter les ressources serveur
# Ajouter du caching
# Optimiser les requêtes BD
```

---

## Support Production

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **CDN**: CloudFlare, AWS CloudFront

---

**Ready for production!** 🚀
