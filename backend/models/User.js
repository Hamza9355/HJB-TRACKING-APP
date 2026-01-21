const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: String,
  phoneVerificationCode: String,
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'DRIVER', 'OPERATOR'],
    default: 'USER',
  },
  company: String,
  jobTitle: String,
  avatar: String,
  preferences: {
    notifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
  },
  activityLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed,
  }],
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Générer un code de vérification
userSchema.methods.generateVerificationCode = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Enregistrer l'action dans le log
userSchema.methods.logActivity = function(action, details = {}) {
  this.activityLog.push({
    action,
    timestamp: new Date(),
    details,
  });
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
