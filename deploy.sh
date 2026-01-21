#!/bin/bash

# HJB Tracking App - Deployment Helper Script
# Ce script aide à configurer les variables d'environnement pour le déploiement

echo "🚀 Configuration du déploiement HJB Tracking App"
echo "==============================================="
echo ""

# Configuration Backend
echo "📝 Configuration BACKEND"
echo "========================"
read -p "Entrez votre URI MongoDB (mongodb+srv://...): " MONGODB_URI
read -p "Entrez l'URL de votre frontend Vercel (https://...): " FRONTEND_URL

# Créer .env pour backend
cat > backend/.env << EOF
# MongoDB Configuration
MONGODB_URI=$MONGODB_URI

# Frontend Configuration
FRONTEND_URL=$FRONTEND_URL

# Server Configuration
PORT=5000
NODE_ENV=production
EOF

echo "✅ Fichier backend/.env créé"
echo ""

# Configuration Frontend
echo "📝 Configuration FRONTEND"
echo "=========================="
read -p "Entrez l'URL de votre backend Render (https://...): " API_URL

# Créer .env pour frontend
cat > frontend/.env << EOF
# API Configuration
REACT_APP_API_URL=$API_URL/api
REACT_APP_SOCKET_URL=$API_URL
EOF

echo "✅ Fichier frontend/.env créé"
echo ""

# Afficher les liens
echo "🎉 Configuration complète!"
echo ""
echo "📊 Résumé:"
echo "=========="
echo "Backend URL:  $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "⏭️  Prochaines étapes:"
echo "1. Poussez les changements: git add . && git commit -m 'Deploy config' && git push"
echo "2. Vercel et Render se déploieront automatiquement"
echo "3. Votre app sera accessible dans 2-5 minutes"
echo ""
