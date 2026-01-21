require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Routes
const vehicleRoutes = require('./routes/vehicles');
const sessionRoutes = require('./routes/sessions');
const cycleRoutes = require('./routes/cycles');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tracking_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connecté avec succès'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Socket.io pour les mises à jour en temps réel
io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté');
  
  socket.on('join-session', (sessionId) => {
    socket.join(`session-${sessionId}`);
    console.log(`Client rejoint la session: ${sessionId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

// Passer io aux routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur Tracking en ligne',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Une erreur est survenue sur le serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur backend en écoute sur le port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/health`);
});
