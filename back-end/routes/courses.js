const express = require('express');
const router = express.Router();
const {
  getAllMajors,
  getCoursesByMajor,
  getCourseById,
  getAvailableSlotsByCourse
} = require('../controllers/coursesController');

// Course routes
router.get('/majors', getAllMajors);
router.get('/by-major/:majorId', getCoursesByMajor);
router.get('/:courseId', getCourseById);
router.get('/:courseId/slots', getAvailableSlotsByCourse);

module.exports = router;
