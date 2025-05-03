const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const {
  getManagedProperties,
  getPropertyApplications,
  getAllApplications,
  approveApplication,
  rejectApplication,
  getAssociatedCustomers,
  getAssociatedOwners,
} = require("../controllers/realtorController");

// Property-related routes
router.get(
  "/properties",
  authMiddleware,
  roleMiddleware("realtor"),
  getManagedProperties
);
router.get(
  "/properties/:id/applications",
  authMiddleware,
  roleMiddleware("realtor"),
  getPropertyApplications
);

// Application management routes
router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("realtor"),
  getAllApplications
);
router.put(
  "/applications/:id/approve",
  authMiddleware,
  roleMiddleware("realtor"),
  approveApplication
);
router.put(
  "/applications/:id/reject",
  authMiddleware,
  roleMiddleware("realtor"),
  rejectApplication
);

// Relationship management routes
router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("realtor"),
  getAssociatedCustomers
);
router.get(
  "/owners",
  authMiddleware,
  roleMiddleware("realtor"),
  getAssociatedOwners
);

module.exports = router;
