const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const {
  getApplications,
  getAvailableProperties,
  getPropertyDetails,
  submitApplication,
  cancelApplication,
} = require("../controllers/customerController");

// Public property endpoints
router.get("/properties", getAvailableProperties);
router.get("/properties/:id", getPropertyDetails);

// Protected customer endpoints
router.post(
  "/:customerId/apply",
  auth,
  roleMiddleware('customer'),
  submitApplication
);

router.get(
  "/:customerId/applications",
  auth,
  roleMiddleware('customer'),
  getApplications
);

router.delete(
  "/:customerId/applications/:applicationId",
  auth,
  roleMiddleware('customer'),
  cancelApplication
);

module.exports = router;
