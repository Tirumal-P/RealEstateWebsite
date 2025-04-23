const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const {
  getAllRealtors,
  getPropertiesByOwnerId,
  createProperty
} = require("../controllers/ownerController");

//get all realtors
router.get(
  "/realtors",
  authMiddleware,
  roleMiddleware("owner"),
  getAllRealtors
);

//get all properties associated to owner
router.get(
  "/:id/properties",
  authMiddleware,
  roleMiddleware("owner"),
  getPropertiesByOwnerId
);

//create new property
router.post(
    "/:id/createproperty",
    authMiddleware,
    roleMiddleware("owner"),
    createProperty
  );

module.exports = router;
