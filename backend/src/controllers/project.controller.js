const prisma = require("../utils/prisma");

/*
========================================
GET ALL PROJECTS
========================================
*/
exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        bids: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

/*
========================================
GET SINGLE PROJECT
========================================
*/
exports.getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        bids: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        milestones: true,
        reviews: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

/*
========================================
CREATE PROJECT
========================================
*/
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budgetMin,
      budgetMax,
      category,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        clientId: req.user.id,
        title,
        description,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        category,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    res.status(500).json({
      message: "Project creation failed",
      error: error.message,
    });
  }
};