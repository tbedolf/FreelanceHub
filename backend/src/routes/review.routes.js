const express = require("express");

const { requireAuth } = require("../middleware/auth");

const {
  createReview,
} = require("../controllers/review.controller");

const router = express.Router();

/*
========================================
CREATE REVIEW
========================================
*/
router.post(
  "/",
  requireAuth,
  createReview
);

module.exports = router;