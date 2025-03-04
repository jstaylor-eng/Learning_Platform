const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/username', updateUserProfile);
// Add more routes for getting user, updating user, etc.

module.exports = router;