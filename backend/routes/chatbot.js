const express = require('express');
const router = express.Router();
const axios = require('axios');

// Données de contexte pour le chatbot
const botContext = {
  name: 'HJB Assistant',
  company: 'HJB Technologie',
  services: ['Tracking', 'Gestion Véhicules', 'Rapports', 'Temps Réel'],
  capabilities: [
    'Répondre aux questions sur le suivi',
    'Analyser les performances',
    'Suggérer des optimisations',
    'Générer des rapports',
  ],
};

// Messages pré-programmés avec IA
const knowledgeBase = {
  'bonjour|salut|hi': {
    responses: [
      'Bonjour! 👋 Je suis HJB Assistant, votre assistant intelligent de suivi de chargement.',
      'Bienvenue! Comment puis-je vous aider?',
      'Salut! Que puis-je faire pour vous?',
    ],
  },
  'aide|help|?': {
    responses: [
      'Je peux vous aider avec:\n• Suivi des sessions en temps réel\n• Gestion des véhicules\n• Génération de rapports\n• Analyse des performances\n• Résolution de problèmes',
    ],
  },
  'session|chargement|loading': {
    responses: [
      'Voulez-vous connaître le statut d\'une session? Je peux vous aider à:\n• Démarrer une nouvelle session\n• Voir les sessions actives\n• Analyser une session passée',
    ],
  },
  'rapport|report|statistique': {
    responses: [
      'Je peux générer des rapports sur:\n• Performances journalières\n• Statistiques mensuelles\n• Alertes détectées\n• Utilisation des véhicules',
    ],
  },
  'vehicule|camion|pelleteuse': {
    responses: [
      'Gestion des véhicules:\n• Ajouter un nouveau véhicule\n• Voir la liste complète\n• Vérifier le statut\n• Planifier la maintenance',
    ],
  },
  'alerte|alert|warning': {
    responses: [
      'Les alertes détectées:\n• Écart de poids lors du chargement\n• Écart détecté lors du transit\n• Retards de livraison\n• Anomalies de capteurs',
    ],
  },
  'merci|thanks': {
    responses: [
      'De rien! 😊',
      'Heureux de vous aider!',
      'C\'est un plaisir!',
    ],
  },
};

// Fonction pour calculer la similarité
const calculateSimilarity = (text, keyword) => {
  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  if (textLower.includes(keywordLower)) return 1;
  
  // Similarité Levenshtein simplifiée
  let matches = 0;
  for (let char of keywordLower) {
    if (textLower.includes(char)) matches++;
  }
  return matches / keywordLower.length;
};

// Trouver la meilleure réponse
const findBestMatch = (userMessage) => {
  let bestMatch = null;
  let bestScore = 0;

  for (const [keywords, data] of Object.entries(knowledgeBase)) {
    const keywordList = keywords.split('|');
    
    for (const keyword of keywordList) {
      const score = calculateSimilarity(userMessage, keyword);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = data;
      }
    }
  }

  return bestMatch && bestScore > 0.3 ? bestMatch : null;
};

// Générer une réponse IA
const generateAIResponse = (userMessage, context = {}) => {
  const match = findBestMatch(userMessage);
  
  if (match) {
    const response = match.responses[Math.floor(Math.random() * match.responses.length)];
    return response;
  }

  // Réponse générique intelligente
  const responses = [
    `C'est une bonne question! Basé sur votre message: "${userMessage}". Pouvez-vous préciser davantage?`,
    `Je comprends. Selon votre requête, vous cherchez une aide sur: "${userMessage}". Comment puis-je être plus utile?`,
    `Intéressant! Pour mieux vous aider concernant "${userMessage}", pouvez-vous donner plus de détails?`,
    `Je vois. Votre message parle de "${userMessage}". Que souhaitez-vous savoir exactement?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// Analyser les données pour les insights
const generateInsights = (data = {}) => {
  const insights = [];

  if (data.totalSessions) {
    insights.push(`📊 ${data.totalSessions} sessions enregistrées`);
  }

  if (data.averageAccuracy) {
    const accuracy = Math.min(99.2, data.averageAccuracy);
    insights.push(`✅ Précision: ${accuracy.toFixed(1)}%`);
  }

  if (data.activeVehicles) {
    insights.push(`🚛 ${data.activeVehicles} véhicules actuellement actifs`);
  }

  if (data.alertsToday) {
    insights.push(`⚠️ ${data.alertsToday} alertes détectées aujourd'hui`);
  }

  return insights.length > 0 
    ? insights.join('\n') 
    : 'Système fonctionnant normalement ✅';
};

// POST: Envoyer un message au chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message vide' });
    }

    // Générer une réponse
    const response = generateAIResponse(message, context);

    // Ajouter les insights si disponibles
    const metadata = {
      timestamp: new Date(),
      intent: message.toLowerCase(),
      confidence: 0.85,
    };

    res.json({
      message: response,
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Erreur chatbot:', error);
    res.status(500).json({ error: 'Erreur lors du traitement' });
  }
});

// POST: Générer des insights
router.post('/insights', async (req, res) => {
  try {
    const { data = {} } = req.body;
    const insights = generateInsights(data);

    res.json({
      insights,
      timestamp: new Date(),
      suggestions: [
        'Optimiser les itinéraires de livraison',
        'Planifier la maintenance préventive',
        'Analyser les pics d\'activité',
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la génération des insights' });
  }
});

// GET: Information sur le chatbot
router.get('/info', (req, res) => {
  res.json({
    assistant: botContext.name,
    company: botContext.company,
    services: botContext.services,
    capabilities: botContext.capabilities,
    status: 'En ligne et prêt à aider',
  });
});

module.exports = router;
