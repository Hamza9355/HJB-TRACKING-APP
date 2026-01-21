const express = require('express');
const router = express.Router();
const LoadingSession = require('../models/LoadingSession');
const Vehicle = require('../models/Vehicle');
const ExcavatorCycle = require('../models/ExcavatorCycle');

router.get('/overview', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const todaySessions = await LoadingSession.countDocuments({
      start_time: { $gte: today }
    });
    
    const activeSessions = await LoadingSession.countDocuments({ is_active: true });
    
    const activeVehicles = await Vehicle.countDocuments({ status: 'ACTIF' });
    
    const todayAlerts = await LoadingSession.countDocuments({
      start_time: { $gte: today },
      alert_status: { $in: ['WARNING_LOAD', 'WARNING_THEFT'] }
    });
    
    const weeklyStats = await LoadingSession.aggregate([
      {
        $match: {
          start_time: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$start_time" } },
            status: "$alert_status"
          },
          count: { $sum: 1 },
          totalWeight: { $sum: "$total_weight_excavator" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);
    
    const vehiclesByType = await Vehicle.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIF'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const recentAlerts = await LoadingSession.find({
      alert_status: { $in: ['WARNING_LOAD', 'WARNING_THEFT'] }
    })
    .populate('excavator_id', 'registration_number')
    .populate('truck_id', 'registration_number')
    .sort({ start_time: -1 })
    .limit(10);
    
    const cycleStats = await ExcavatorCycle.aggregate([
      {
        $match: {
          timestamp: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalCycles: { $sum: 1 },
          avgWeight: { $avg: '$bucket_weight' },
          totalWeight: { $sum: '$bucket_weight' },
          avgDistance: { $avg: '$travel_distance' }
        }
      }
    ]);
    
    res.json({
      overview: {
        todaySessions,
        activeSessions,
        activeVehicles,
        todayAlerts,
        cycleStats: cycleStats[0] || {}
      },
      weeklyStats,
      vehiclesByType,
      recentAlerts,
      updated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
