// BUILD PROJECT CONTROLLER HERE
const prisma = require("../utils/prisma");

// Create a new project with current client's ID
const createProject = async (req, res) => {
  console.log(req.user);
  try {
    const { title, description, budgetMin, budgetMax, category } = req.body;
    const clientId = req.user.id;
    const numericBudgetMin = Number(budgetMin);
    const numericBudgetMax = Number(budgetMax);

    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({
        message: "Title, description, and category are required",
      });
    }

    if (
      !Number.isFinite(numericBudgetMin) ||
      !Number.isFinite(numericBudgetMax) ||
      numericBudgetMin < 0 ||
      numericBudgetMax < numericBudgetMin
    ) {
      return res.status(400).json({ message: "Invalid budget range" });
    }

    // Create the project
    const project = await prisma.project.create({
      // Validates numerical data
      data: {
        clientId,
        title: title.trim(),
        description: description.trim(),
        budgetMin: numericBudgetMin,
        budgetMax: numericBudgetMax,
        category: category.trim(),
      },
      // Includes relation fields: client, bids, milestones, reviews
      // Client data pulled from existing client, the other 3 are empty arrays
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find a project based on its ID
const getProject = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Attempt to find a single matching project
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        },
        bids: {
          include: {
            freelancer: { select: { id: true, name: true, role: true } },
          },
        },
        milestones: true,
        reviews: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for projects
// This is meant to be a general search query
// It can search off of various criteria
// Example usage: ../api/projects?title=Test Project
const searchProjects = async (req, res) => {
  try {
    const { title, clientId, category, status, budgetMin, budgetMax } = req.query;

    const where = {};

    // title search includes partial matches
    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (clientId) {
      where.clientId = Number(clientId);
    }

    // Category is case insensitive
    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (status) {
      const validStatuses = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid project status" });
      }
      where.status = status;
    }

    if (budgetMin || budgetMax) {
      const minimum = budgetMin ? Number(budgetMin) : null;
      const maximum = budgetMax ? Number(budgetMax) : null;
      if ((minimum !== null && !Number.isFinite(minimum)) ||
          (maximum !== null && !Number.isFinite(maximum)) ||
          (minimum !== null && maximum !== null && maximum < minimum)) {
        return res.status(400).json({ message: "Invalid budget filter" });
      }
      where.AND = [];
      if (minimum !== null) where.AND.push({ budgetMax: { gte: minimum } });
      if (maximum !== null) where.AND.push({ budgetMin: { lte: maximum } });
    }

    // Find all the projects that match the search
    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        },
        bids: true,
        milestones: true,
        reviews: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a project with specified project ID
const updateProject = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role !== "ADMIN" && project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "You can only modify your own projects",
      });
    }


    if (req.user.role !== "ADMIN" && project.status !== "OPEN") {
      return res.status(400).json({
        message: "Projects can only be edited before hiring a freelancer",
      });
    }

    const nextBudgetMin = req.body.budgetMin === undefined
      ? project.budgetMin
      : Number(req.body.budgetMin);
    const nextBudgetMax = req.body.budgetMax === undefined
      ? project.budgetMax
      : Number(req.body.budgetMax);
    if (!Number.isFinite(nextBudgetMin) || !Number.isFinite(nextBudgetMax) ||
        nextBudgetMin < 0 || nextBudgetMax < nextBudgetMin) {
      return res.status(400).json({ message: "Invalid budget range" });
    }

    const updated = await prisma.project.update({
      where: { id },

      // Validate given data
      data: {
        title: req.body.title,
        description: req.body.description,
        budgetMin:
          req.body.budgetMin !== undefined
            ? Number(req.body.budgetMin)
            : undefined,
        budgetMax:
          req.body.budgetMax !== undefined
            ? Number(req.body.budgetMax)
            : undefined,
        category: req.body.category,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project with specified project ID
const deleteProject = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role !== "ADMIN" && project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "You can only modify your own projects",
      });
    }

    await prisma.$transaction([
      prisma.review.deleteMany({ where: { projectId: id } }),
      prisma.milestone.deleteMany({ where: { projectId: id } }),
      prisma.bid.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeProject = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: { milestones: true },
  });
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (req.user.role !== "ADMIN" && project.clientId !== req.user.id) {
    return res.status(403).json({ message: "Only the project owner can complete it" });
  }
  if (project.status !== "IN_PROGRESS") {
    return res.status(400).json({ message: "Only active projects can be completed" });
  }
  if (project.milestones.length === 0 ||
      project.milestones.some((milestone) => milestone.status !== "APPROVED")) {
    return res.status(400).json({ message: "All milestones must be approved first" });
  }

  const updated = await prisma.project.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
  return res.json(updated);
};

module.exports = {
  createProject,
  getProject,
  searchProjects,
  updateProject,
  deleteProject,
  completeProject,
};
