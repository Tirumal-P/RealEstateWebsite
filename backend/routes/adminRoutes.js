const express = require("express");
const router = express.Router();
const {
  approveUser,
  rejectUser,
  getStats,
  getPendingOwners,
  getPendingRealtors,
  getAllOwners,
  deleteOwner,
  getAllRealtors,
  deleteRealtor
} = require("../controllers/adminController");
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

router.get("/stats", authMiddleware, roleMiddleware("admin"), getStats);

router.get(
  "/owners/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingOwners
);

router.get(
  "/realtors/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingRealtors
);

router.get("/owners", authMiddleware, roleMiddleware("admin"), getAllOwners);

router.delete(
  "/owners/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteOwner
);

router.get(
  "/realtors",
  authMiddleware,
  roleMiddleware("admin"),
  getAllRealtors
);

router.delete(
  "/realtors/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteRealtor
);

module.exports = router;
