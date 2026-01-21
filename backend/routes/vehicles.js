const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    let filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const vehicles = await Vehicle.find(filter).sort({ created_at: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const vehicleData = req.body;
    
    if (!vehicleData.qr_code) {
      vehicleData.qr_code = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    
    if (req.io) {
      req.io.emit('vehicle-added', vehicle);
    }
    
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    
    if (req.io) {
      req.io.emit('vehicle-updated', vehicle);
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    
    if (req.io) {
      req.io.emit('vehicle-deleted', req.params.id);
    }
    
    res.json({ message: 'Véhicule supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIF'] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ['$status', 'MAINTENANCE'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const total = await Vehicle.countDocuments();
    
    res.json({
      total,
      byType: stats,
      updated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
