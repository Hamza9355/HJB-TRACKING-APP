const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CAMION', 'PELLETEUSE'],
    required: true
  },
  registration_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  qr_code: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['ACTIF', 'MAINTENANCE', 'HORS_SERVICE'],
    default: 'ACTIF'
  },
  model: {
    type: String,
    default: 'Non spécifié'
  },
  capacity: {
    type: Number,
    default: 0
  },
  manufacturer: {
    type: String,
    default: 'Inconnu'
  },
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  last_maintenance: {
    type: Date,
    default: null
  },
  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

vehicleSchema.index({ type: 1, status: 1 });
vehicleSchema.index({ registration_number: 1 }, { unique: true });

vehicleSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
