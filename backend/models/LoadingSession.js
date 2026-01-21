const mongoose = require('mongoose');

const loadingSessionSchema = new mongoose.Schema({
  excavator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  truck_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  start_time: {
    type: Date,
    required: true,
    default: Date.now
  },
  end_time: {
    type: Date,
    default: null
  },
  departure_time: {
    type: Date,
    default: null
  },
  arrival_time: {
    type: Date,
    default: null
  },
  total_weight_excavator: {
    type: Number,
    default: 0
  },
  total_weight_truck_start: {
    type: Number,
    default: 0
  },
  total_weight_truck_arrival: {
    type: Number,
    default: 0
  },
  weight_gap_loading: {
    type: Number,
    default: 0
  },
  weight_gap_transit: {
    type: Number,
    default: 0
  },
  tolerance_threshold: {
    type: Number,
    default: 50
  },
  alert_status: {
    type: String,
    enum: ['OK', 'WARNING_LOAD', 'WARNING_THEFT', 'EN_COURS'],
    default: 'EN_COURS'
  },
  destination: {
    type: String,
    default: 'Site de déchargement'
  },
  estimated_duration: {
    type: Number,
    default: 60
  },
  operator_name: {
    type: String,
    default: 'Opérateur inconnu'
  },
  notes: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

loadingSessionSchema.index({ is_active: 1, alert_status: 1 });
loadingSessionSchema.index({ excavator_id: 1, start_time: -1 });
loadingSessionSchema.index({ truck_id: 1, start_time: -1 });

loadingSessionSchema.methods.calculateGaps = function() {
  if (this.total_weight_excavator > 0 && this.total_weight_truck_start > 0) {
    this.weight_gap_loading = Math.abs(this.total_weight_excavator - this.total_weight_truck_start);
    
    if (this.weight_gap_loading > this.tolerance_threshold) {
      this.alert_status = 'WARNING_LOAD';
    }
  }
  
  if (this.total_weight_truck_start > 0 && this.total_weight_truck_arrival > 0) {
    this.weight_gap_transit = Math.abs(this.total_weight_truck_start - this.total_weight_truck_arrival);
    
    if (this.weight_gap_transit > this.tolerance_threshold) {
      this.alert_status = 'WARNING_THEFT';
    }
    
    if (this.alert_status === 'EN_COURS') {
      this.alert_status = 'OK';
    }
  }
};

loadingSessionSchema.pre('save', function(next) {
  this.calculateGaps();
  next();
});

module.exports = mongoose.model('LoadingSession', loadingSessionSchema);
