const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");

const {
  createMilestone,
  getMilestone,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestone.controller");

// I have it set so only the client or an admin can use create/update/delete

// Create a new milestone
router.post("/", requireAuth, requireRole("CLIENT", "ADMIN"), createMilestone);

// Get a single milestone by ID
router.get("/:id", requireAuth, getMilestone);

// Update a milestone by ID
router.put(
  "/:id",
  requireAuth,
  requireRole("CLIENT", "ADMIN", "FREELANCER"),
  updateMilestone,
);

// Delete a milestone by ID
router.delete(
  "/:id",
  requireAuth,
  requireRole("CLIENT", "ADMIN"),
  deleteMilestone,
);

module.exports = router;
