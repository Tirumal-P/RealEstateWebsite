const express = require('express');
const router = express.Router();
const {
  adminLogin,
  userLogin
} = require('../controllers/authController');

// Admin Login
router.post('/admin/login', adminLogin);

// Customer Login
router.post('/customer/login', userLogin(require('../models/Customer'), 'customer'));

// Owner Login
router.post('/owner/login', userLogin(require('../models/Owner'), 'owner'));

// Realtor Login
router.post('/realtor/login', userLogin(require('../models/Realtor'), 'realtor'));

module.exports = router;