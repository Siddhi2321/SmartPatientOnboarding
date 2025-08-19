const express = require('express');
const router = express.Router();
const { createAppointment, getDepartmentAppointments, updateAppointmentStatus, updateMedicalRecord } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(createAppointment);
router.route('/department').get(protect, getDepartmentAppointments);
router.route('/:id/status').put(protect, updateAppointmentStatus);
router.route('/:id/record').put(protect, updateMedicalRecord);

module.exports = router;
