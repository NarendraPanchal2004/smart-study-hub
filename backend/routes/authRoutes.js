const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, admin, getAllUsers);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
