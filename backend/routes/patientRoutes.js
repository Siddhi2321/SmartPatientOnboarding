const express = require('express');
const router = express.Router();
const { getPatientById, getPatientWithAppointments } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected, only logged-in staff can access patient data.
router.route('/:patientId').get(protect, getPatientById);
router.route('/details/:patientId').get(protect, getPatientWithAppointments);


module.exports = router;