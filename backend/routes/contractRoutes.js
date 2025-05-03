const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const controller = require("../controllers/contractController");
const {
  createContract,
  getRealtorContracts,
  getCustomerContracts,
  customerSign,
  customerReject,
  getOwnerContracts,
  ownerSign,
  ownerReject,
  getContractById,
} = require("../controllers/contractController");

// Realtor routes
router.post(
  "/realtor/contracts",
  auth,
  roleMiddleware("realtor"),
  createContract
);
router.get(
  "/realtor/contracts",
  auth,
  roleMiddleware("realtor"),
  getRealtorContracts
);

// Customer routes
router.get(
  "/customer/:customerId/contracts",
  auth,
  roleMiddleware("customer"),
  getCustomerContracts
);
router.put(
  "/customer/:customerId/contracts/:contractId/sign",
  auth,
  roleMiddleware("customer"),
  customerSign
);
router.put(
  "/customer/:customerId/contracts/:contractId/reject",
  auth,
  roleMiddleware("customer"),
  customerReject
);

// Owner routes
router.get(
  "/owner/:ownerId/contracts",
  auth,
  roleMiddleware("owner"),
  getOwnerContracts
);
router.put(
  "/owner/:ownerId/contracts/:contractId/sign",
  auth,
  roleMiddleware("owner"),
  ownerSign
);
router.put(
  "/owner/:ownerId/contracts/:contractId/reject",
  auth,
  roleMiddleware("owner"),
  ownerReject
);

// General contract routes
router.get(
  "/contracts/:contractId",
  auth,
  roleMiddleware("realtor"),
  getContractById
);

module.exports = router;
