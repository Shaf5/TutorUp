const express = require('express');
const router = express.Router();
const {
  getTutorById,
  getTutorProfile,
  updateTutorProfile
} = require('../controllers/tutorsController');

// Tutor routes
router.get('/:tutorId', getTutorById);
router.get('/:tutorId/profile', getTutorProfile);
router.put('/:tutorId/profile', updateTutorProfile);

module.exports = router;
