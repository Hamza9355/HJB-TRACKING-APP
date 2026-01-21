# HJB Tracking App - Deployment Helper Script (Windows)
# Ce script aide à configurer les variables d'environnement pour le déploiement

Write-Host "🚀 Configuration du déploiement HJB Tracking App" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Configuration Backend
Write-Host "📝 Configuration BACKEND" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
$MONGODB_URI = Read-Host "Entrez votre URI MongoDB (mongodb+srv://...)"
$FRONTEND_URL = Read-Host "Entrez l'URL de votre frontend Vercel (https://...)"

# Créer .env pour backend
$backendEnv = @"
# MongoDB Configuration
MONGODB_URI=$MONGODB_URI

# Frontend Configuration
FRONTEND_URL=$FRONTEND_URL

# Server Configuration
PORT=5000
NODE_ENV=production
"@

$backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
Write-Host "✅ Fichier backend\.env créé" -ForegroundColor Green
Write-Host ""

# Configuration Frontend
Write-Host "📝 Configuration FRONTEND" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
$API_URL = Read-Host "Entrez l'URL de votre backend Render (https://...)"

# Créer .env pour frontend
$frontendEnv = @"
# API Configuration
REACT_APP_API_URL=$API_URL/api
REACT_APP_SOCKET_URL=$API_URL
"@

$frontendEnv | Out-File -FilePath "frontend\.env" -Encoding UTF8
Write-Host "✅ Fichier frontend\.env créé" -ForegroundColor Green
Write-Host ""

# Afficher les liens
Write-Host "🎉 Configuration complète!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Résumé:" -ForegroundColor Yellow
Write-Host "==========" -ForegroundColor Yellow
Write-Host "Backend URL:  $API_URL" -ForegroundColor Cyan
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏭️  Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Poussez les changements: git add . && git commit -m 'Deploy config' && git push" -ForegroundColor White
Write-Host "2. Vercel et Render se déploieront automatiquement" -ForegroundColor White
Write-Host "3. Votre app sera accessible dans 2-5 minutes" -ForegroundColor White
Write-Host ""
