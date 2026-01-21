const mongoose = require('mongoose');

const excavatorCycleSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoadingSession',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  bucket_weight: {
    type: Number,
    required: true,
    min: 0
  },
  travel_distance: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  cycle_duration: {
    type: Number,
    default: 0
  },
  bucket_capacity: {
    type: Number,
    default: 1.5
  },
  material_type: {
    type: String,
    enum: ['GRAVIER', 'SABLE', 'TERRE', 'PIERRES', 'AUTRE'],
    default: 'GRAVIER'
  },
  gps_data: {
    start: {
      latitude: Number,
      longitude: Number
    },
    end: {
      latitude: Number,
      longitude: Number
    }
  },
  sensor_status: {
    type: String,
    enum: ['OK', 'ERREUR', 'CALIBRATION'],
    default: 'OK'
  }
});

excavatorCycleSchema.index({ session_id: 1, timestamp: 1 });
excavatorCycleSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ExcavatorCycle', excavatorCycleSchema);
