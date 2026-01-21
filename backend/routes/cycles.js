const express = require('express');
const router = express.Router();
const ExcavatorCycle = require('../models/ExcavatorCycle');

router.get('/session/:sessionId', async (req, res) => {
  try {
    const cycles = await ExcavatorCycle.find({ session_id: req.params.sessionId })
      .sort({ timestamp: 1 });
    
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
