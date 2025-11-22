const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentPassword,
  markAttendance,
  submitReview,
  deleteStudentAccount
} = require('../controllers/studentsController');

// Student routes
router.get('/:studentId/profile', getStudentProfile);
router.put('/:studentId/password', updateStudentPassword);
router.put('/attendance/:bookingId', markAttendance);
router.post('/review/:bookingId', submitReview);
router.delete('/:studentId', deleteStudentAccount);

module.exports = router;
