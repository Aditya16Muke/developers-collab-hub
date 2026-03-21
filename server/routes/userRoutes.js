const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile',  protect, getUserProfile); // own profile via token
router.put('/profile',  protect, updateProfile);
router.get('/:id',              getUserProfile);  // public profile by ID

module.exports = router;