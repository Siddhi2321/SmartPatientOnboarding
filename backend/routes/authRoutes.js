const express = require('express');
const router = express.Router();
const { registerStaff, loginStaff, getStaffProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStaff); // Should be protected for admins in a real app
router.post('/login', loginStaff);
router.get('/profile', protect, getStaffProfile);

module.exports = router;