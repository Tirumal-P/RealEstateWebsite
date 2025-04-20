const express = require('express');
const router = express.Router();
const { createProperty, getProperties } = require('../controllers/propertyController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.post('/',
  authMiddleware,
  roleMiddleware('owner'),
  createProperty
);

router.get('/', getProperties);

module.exports = router;