const express = require('express');
const router = express.Router();
const {
  adminLogin,
  userLogin,
  userSignup
} = require('../controllers/authController');
const customer = require('../models/Customer');
const owner = require('../models/Owner');
const realtor = require('../models/Realtor');

// Admin Login
router.post('/admin/login', adminLogin);

// Customer Login
router.post('/customer/login', userLogin(require('../models/Customer'), 'customer'));

// Owner Login
router.post('/owner/login', userLogin(require('../models/Owner'), 'owner'));

// Realtor Login
router.post('/realtor/login', userLogin(require('../models/Realtor'), 'realtor'));

// Customer Signup
router.post('/signup/customer', userSignup(customer, 'customer'));

// Owner Signup
router.post('/signup/owner', userSignup(owner, 'owner'));

// Realtor Signup
router.post('/signup/realtor', userSignup(realtor, 'realtor'));

module.exports = router;