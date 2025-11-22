const express = require('express');
const router = express.Router();
const {
  createBooking,
  cancelBooking,
  getStudentUpcomingSessions,
  getStudentPastSessions,
  getTutorUpcomingSessions,
  getTutorPastSessions
} = require('../controllers/bookingsController');

// Booking routes
router.post('/', createBooking);
router.delete('/:bookingId', cancelBooking);

// Student session routes
router.get('/student/:studentId/upcoming', getStudentUpcomingSessions);
router.get('/student/:studentId/past', getStudentPastSessions);

// Tutor session routes
router.get('/tutor/:tutorId/upcoming', getTutorUpcomingSessions);
router.get('/tutor/:tutorId/past', getTutorPastSessions);

module.exports = router;
