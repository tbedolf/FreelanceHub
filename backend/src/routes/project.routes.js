const express = require("express");
const prisma = require("../utils/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      client: { select: { id: true, name: true } },
      bids: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(projects);
});

router.get("/:id", async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      client: { select: { id: true, name: true } },
      bids: { include: { freelancer: { select: { id: true, name: true } } } },
      milestones: true,
      reviews: true
    }
  });

  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
});

router.post("/", requireAuth, requireRole("CLIENT", "ADMIN"), async (req, res) => {
  try {
    const { title, description, budgetMin, budgetMax, category } = req.body;

    const project = await prisma.project.create({
      data: {
        clientId: req.user.id,
        title,
        description,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        category
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Project creation failed", error: error.message });
  }
});

module.exports = router;
