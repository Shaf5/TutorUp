const express = require('express');
const router = express.Router();
const {
  studentSignup,
  tutorSignup,
  studentSignin,
  tutorSignin
} = require('../controllers/authController');

// Student authentication
router.post('/student/signup', studentSignup);
router.post('/student/signin', studentSignin);

// Tutor authentication
router.post('/tutor/signup', tutorSignup);
router.post('/tutor/signin', tutorSignin);

module.exports = router;
