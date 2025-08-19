const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createDepartment).get(getAllDepartments);

module.exports = router;