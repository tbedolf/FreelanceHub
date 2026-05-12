const express = require("express");
const prisma = require("../utils/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

/*
CREATE MILESTONE - CLIENT OWNER ONLY
*/
router.post("/", requireAuth, async (req, res) => {
  try {
    const { projectId, title, description, dueDate } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "Only the project owner can create milestones",
      });
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId: Number(projectId),
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json(milestone);
  } catch (error) {
    console.error("CREATE MILESTONE ERROR:", error);
    res.status(500).json({
      message: "Milestone creation failed",
      error: error.message,
    });
  }
});

/*
SUBMIT MILESTONE - FREELANCER
*/
router.put("/:id/submit", requireAuth, async (req, res) => {
  try {
    const milestoneId = Number(req.params.id);

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          include: {
            bids: true,
          },
        },
      },
    });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    const acceptedBid = milestone.project.bids.find(
      (bid) => bid.status === "ACCEPTED" && bid.freelancerId === req.user.id
    );

    if (!acceptedBid) {
      return res.status(403).json({
        message: "Only the accepted freelancer can submit this milestone",
      });
    }

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "SUBMITTED" },
    });

    res.json(updated);
  } catch (error) {
    console.error("SUBMIT MILESTONE ERROR:", error);
    res.status(500).json({
      message: "Milestone submission failed",
      error: error.message,
    });
  }
});

/*
APPROVE MILESTONE - CLIENT OWNER ONLY
*/
router.put("/:id/approve", requireAuth, async (req, res) => {
  try {
    const milestoneId = Number(req.params.id);

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: true,
      },
    });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    if (milestone.project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "Only the project owner can approve this milestone",
      });
    }

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "APPROVED" },
    });

    const remaining = await prisma.milestone.count({
      where: {
        projectId: milestone.projectId,
        status: { not: "APPROVED" },
      },
    });

    if (remaining === 0) {
      await prisma.project.update({
        where: { id: milestone.projectId },
        data: { status: "COMPLETED" },
      });
    }

    res.json(updated);
  } catch (error) {
    console.error("APPROVE MILESTONE ERROR:", error);
    res.status(500).json({
      message: "Milestone approval failed",
      error: error.message,
    });
  }
});

module.exports = router;