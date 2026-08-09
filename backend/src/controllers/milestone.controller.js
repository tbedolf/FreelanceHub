const prisma = require("../utils/prisma");

// Added additional ownership checks on top of
// what the routes check
// Can add them to project controller if you'd like

const createMilestone = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const projectId = Number(req.body.projectId);

    if (isNaN(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    // Added validation for the project.
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only project owner or admin can create milestones
    if (req.user.role !== "ADMIN" && project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "You cannot add milestones to this project",
      });
    }

    if (project.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "Milestones can only be created for active projects",
      });
    }

    // I made title, description, due date all mandatory
    // Not sure which ones you want to be mandatory so adjust however
    if (!title || !description || !dueDate) {
      // Requires all fields
      return res.status(400).json({
        message: "Missing field(s)",
      });
    }

    /*
    // Validate status
    const validStatuses = ["TODO", "IN_PROGRESS", "SUBMITTED", "APPROVED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }*/

    // Validate date
    const parsedDate = new Date(dueDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid due date",
      });
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        dueDate: parsedDate,
        status: "TODO",
        projectId,
      },

      // I'm not sure how much of the project data is necessary
      // I cut everything but id/title
      // Commented out so you can easily add ones that are necessary
      include: {
        project: {
          select: {
            id: true,
            title: true,
            //clientId: true,
            //description: true,
            //budgetMin: true,
            //budgetMax: true,
            //category: true,
          },
        },
      },
    });
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gets milestone by ID
const getMilestone = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid milestone ID",
      });
    }

    const milestone = await prisma.milestone.findUnique({
      where: {
        id,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            clientId: true,
          },
        },
      },
    });

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found",
      });
    }

    const acceptedBid = await prisma.bid.findFirst({
      where: { projectId: milestone.projectId, status: "ACCEPTED" },
    });

    const canAccess =
      req.user.role === "ADMIN" ||
      milestone.project.clientId === req.user.id ||
      acceptedBid?.freelancerId === req.user.id;

    if (!canAccess) {
      return res.status(403).json({
        message: "You do not have permission to access this milestone",
      });
    }

    res.status(200).json(milestone);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Updates milestone with given ID
const updateMilestone = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid milestone ID" });
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found",
      });
    }
    const acceptedBid = await prisma.bid.findFirst({
      where: { projectId: milestone.projectId, status: "ACCEPTED" },
    });

    const isAdmin = req.user.role === "ADMIN";
    const isOwner = milestone.project.clientId === req.user.id;
    const isAssignedFreelancer = acceptedBid?.freelancerId === req.user.id;

    if (!isAdmin && !isOwner && !isAssignedFreelancer) {
      return res.status(403).json({
        message: "You are not assigned to this project",
      });
    }

    const { title, description, dueDate, status } = req.body;

    const validStatuses = ["TODO", "IN_PROGRESS", "SUBMITTED", "APPROVED"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }

    if (req.user.role === "FREELANCER" && !["IN_PROGRESS", "SUBMITTED"].includes(status)) {
      return res.status(403).json({
        message: "Freelancers can only start or submit milestones",
      });
    }

    if (req.user.role === "CLIENT" && status !== "APPROVED") {
      return res.status(403).json({
        message: "Clients can only approve submitted milestones",
      });
    }

    if (status === "IN_PROGRESS" && milestone.status !== "TODO") {
      return res.status(400).json({ message: "Only TODO milestones can be started" });
    }

    if (status === "SUBMITTED" && milestone.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "Only in-progress milestones can be submitted",
      });
    }

    if (status === "APPROVED" && milestone.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Only submitted milestones can be approved",
      });
    }

    // Validate due date
    let parsedDate;
    // Only if it's actually being updated
    if (dueDate) {
      parsedDate = new Date(dueDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid due date",
        });
      }
    }

    const updated = await prisma.milestone.update({
      where: { id },

      // Only updates if new data exists
      // I'm not entirely sure how this works but it does
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(parsedDate !== undefined && { dueDate: parsedDate }),
        ...(status !== undefined && { status }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            //clientId: true,
            //description: true,
            //budgetMin: true,
            //budgetMax: true,
            //category: true,
          },
        },
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deletes milestone with given ID
const deleteMilestone = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid milestone ID" });
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found",
      });
    }

    // project's owner and admin only
    if (
      req.user.role !== "ADMIN" &&
      milestone.project.clientId !== req.user.id
    ) {
      return res.status(403).json({
        message: "You do not have permission to access this milestone",
      });
    }

    await prisma.milestone.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMilestone,
  getMilestone,
  updateMilestone,
  deleteMilestone,
};
