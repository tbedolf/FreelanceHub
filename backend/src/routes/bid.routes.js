const express = require("express");

const {
  createBid,
  acceptBid,
} = require("../controllers/bid.controller");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

/*
========================================
CREATE BID (FREELANCER ONLY)
========================================
*/
router.post(
  "/",
  requireAuth,
  requireRole("FREELANCER"),
  createBid
);

/*
========================================
ACCEPT BID (CLIENT ONLY)
========================================
*/
router.put(
  "/:id/accept",
  requireAuth,
  requireRole("CLIENT"),
  acceptBid
);

module.exports = router;