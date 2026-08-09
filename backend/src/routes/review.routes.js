const express = require("express");
const router = express.Router();
const {
  createReview,
  getProjectReviews,
} = require("../controllers/review.controller");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, createReview);
router.get("/project/:projectId", getProjectReviews);

module.exports = router;
