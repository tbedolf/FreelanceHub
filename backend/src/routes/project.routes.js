const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");

const {
  createProject,
  getProject,
  searchProjects,
  updateProject,
  deleteProject,
  completeProject,
} = require("../controllers/project.controller");

// I have it set so only the client or an admin can use create/update/delete

// Create a new project
router.post("/", requireAuth, requireRole("CLIENT", "ADMIN"), createProject);

// this one doesn't require login as I figure a general search
// doesn't need a user to be logged in to use
// Search projects (GET /api/projects?title=...&clientId=...&category=...)
router.get("/", searchProjects);

// Get a single project by ID
router.get("/:id", requireAuth, getProject);

// Update a project by ID
router.put("/:id", requireAuth, requireRole("CLIENT", "ADMIN"), updateProject);
router.put("/:id/complete", requireAuth, requireRole("CLIENT", "ADMIN"), completeProject);

// Delete a project by ID
router.delete(
  "/:id",
  requireAuth,
  requireRole("CLIENT", "ADMIN"),
  deleteProject,
);

module.exports = router;
