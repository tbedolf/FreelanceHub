const express = require("express");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const {
  getProjects,
  getProjectById,
  createProject,
} = require("../controllers/project.controller");

const router = express.Router();

/*
========================================
GET ALL PROJECTS
========================================
*/
router.get("/", getProjects);

/*
========================================
GET SINGLE PROJECT
========================================
*/
router.get("/:id", getProjectById);

/*
========================================
CREATE PROJECT
========================================
*/
router.post(
  "/",
  requireAuth,
  requireRole("CLIENT", "ADMIN"),
  createProject
);

module.exports = router;