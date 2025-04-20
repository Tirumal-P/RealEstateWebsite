const express = require("express");
const router = express.Router();
const { approveUser, rejectUser, getStats, getPendingOwners, getPendingRealtors } = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

router.patch(
  "/users/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveUser
);

router.patch(
  "/users/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectUser
);

router.get("/stats", authMiddleware, roleMiddleware("admin"),getStats);

router.get("/owners/pending", authMiddleware, roleMiddleware("admin"),getPendingOwners);

router.get("/realtors/pending", authMiddleware, roleMiddleware("admin"),getPendingRealtors);

module.exports = router;
