const express = require("express");

const {
  createBid,
  acceptBid,
  getMyBids,
  rejectBid,
} = require("../controllers/bid.controller");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

router.get("/mine", requireAuth, requireRole("FREELANCER"), getMyBids);

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

router.put(
  "/:id/reject",
  requireAuth,
  requireRole("CLIENT", "ADMIN"),
  rejectBid
);

module.exports = router;
