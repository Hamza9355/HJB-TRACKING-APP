const express = require('express');
const router = express.Router();
const LoadingSession = require('../models/LoadingSession');
const ExcavatorCycle = require('../models/ExcavatorCycle');
const Vehicle = require('../models/Vehicle');

router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    let filter = {};
    
    if (status && status !== 'ALL') {
      filter.alert_status = status;
    }
    
    if (startDate || endDate) {
      filter.start_time = {};
      if (startDate) filter.start_time.$gte = new Date(startDate);
      if (endDate) filter.start_time.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sessions = await LoadingSession.find(filter)
      .populate('excavator_id', 'registration_number type model')
      .populate('truck_id', 'registration_number type model')
      .sort({ start_time: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await LoadingSession.countDocuments(filter);
    
    res.json({
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await LoadingSession.findById(req.params.id)
      .populate('excavator_id')
      .populate('truck_id');
    
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    const cycles = await ExcavatorCycle.find({ session_id: req.params.id })
      .sort({ timestamp: 1 });
    
    res.json({
      session,
      cycles,
      totalCycles: cycles.length,
      totalWeight: cycles.reduce((sum, cycle) => sum + cycle.bucket_weight, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { excavator_id, truck_id, operator_name, destination } = req.body;
    
    const excavator = await Vehicle.findById(excavator_id);
    const truck = await Vehicle.findById(truck_id);
    
    if (!excavator || !truck) {
      return res.status(404).json({ error: 'Véhicule(s) non trouvé(s)' });
    }
    
    const sessionData = {
      excavator_id,
      truck_id,
      operator_name: operator_name || 'Opérateur inconnu',
      destination: destination || 'Site de déchargement',
      start_time: new Date(),
      alert_status: 'EN_COURS',
      is_active: true
    };
    
    const session = new LoadingSession(sessionData);
    await session.save();
    
    if (req.io) {
      req.io.emit('session-started', session);
      req.io.to(`session-${session._id}`).emit('session-update', session);
    }
    
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/add-cycle', async (req, res) => {
  try {
    const { bucket_weight, travel_distance, material_type } = req.body;
    
    const session = await LoadingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    const cycle = new ExcavatorCycle({
      session_id: req.params.id,
      bucket_weight,
      travel_distance: travel_distance || 0,
      material_type: material_type || 'GRAVIER',
      timestamp: new Date()
    });
    
    await cycle.save();
    
    session.total_weight_excavator += bucket_weight;
    await session.save();
    
    if (req.io) {
      req.io.emit('cycle-added', { sessionId: req.params.id, cycle });
      req.io.to(`session-${req.params.id}`).emit('session-update', session);
    }
    
    res.json({
      cycle,
      session,
      message: 'Cycle ajouté avec succès'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/record-departure', async (req, res) => {
  try {
    const { total_weight_truck_start } = req.body;
    
    const session = await LoadingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    session.total_weight_truck_start = total_weight_truck_start;
    session.departure_time = new Date();
    await session.save();
    
    if (req.io) {
      req.io.emit('departure-recorded', session);
      req.io.to(`session-${req.params.id}`).emit('session-update', session);
    }
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/record-arrival', async (req, res) => {
  try {
    const { total_weight_truck_arrival } = req.body;
    
    const session = await LoadingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    session.total_weight_truck_arrival = total_weight_truck_arrival;
    session.arrival_time = new Date();
    session.end_time = new Date();
    session.is_active = false;
    await session.save();
    
    if (req.io) {
      req.io.emit('arrival-recorded', session);
      req.io.to(`session-${req.params.id}`).emit('session-completed', session);
    }
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/stats/daily', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await LoadingSession.aggregate([
      {
        $match: {
          start_time: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$alert_status',
          count: { $sum: 1 },
          totalWeight: { $sum: '$total_weight_excavator' },
          avgGapLoading: { $avg: '$weight_gap_loading' },
          avgGapTransit: { $avg: '$weight_gap_transit' }
        }
      }
    ]);
    
    const activeSessions = await LoadingSession.countDocuments({ is_active: true });
    
    res.json({
      date: today.toISOString().split('T')[0],
      activeSessions,
      stats,
      updated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
