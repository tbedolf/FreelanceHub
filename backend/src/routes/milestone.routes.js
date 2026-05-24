const express = require("express");

const { requireAuth } = require("../middleware/auth");

const {
  createMilestone,
  submitMilestone,
  approveMilestone,
} = require("../controllers/milestone.controller");

const router = express.Router();

/*
========================================
CREATE MILESTONE
========================================
*/
router.post(
  "/",
  requireAuth,
  createMilestone
);

/*
========================================
SUBMIT MILESTONE
========================================
*/
router.put(
  "/:id/submit",
  requireAuth,
  submitMilestone
);

/*
========================================
APPROVE MILESTONE
========================================
*/
router.put(
  "/:id/approve",
  requireAuth,
  approveMilestone
);

module.exports = router;