const express = require('express');
const router = express.Router();
const {
  getTodaySlots,
  getTomorrowSlots
} = require('../controllers/slotsController');

// Slot routes
router.get('/today', getTodaySlots);
router.get('/tomorrow', getTomorrowSlots);

module.exports = router;
