const prisma = require("../utils/prisma");

/*
========================================
CREATE REVIEW
========================================
*/
exports.createReview = async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;

    const project = await prisma.project.findUnique({
      where: {
        id: Number(projectId),
      },
      include: {
        bids: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    /*
    ========================================
    ONLY PROJECT OWNER CAN REVIEW
    ========================================
    */
    if (project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "Only project owner can review",
      });
    }

    /*
    ========================================
    PROJECT MUST BE COMPLETED
    ========================================
    */
    if (project.status !== "COMPLETED") {
      return res.status(400).json({
        message: "Project is not completed yet",
      });
    }

    /*
    ========================================
    FIND ACCEPTED FREELANCER
    ========================================
    */
    const acceptedBid = project.bids.find(
      (b) => b.status === "ACCEPTED"
    );

    if (!acceptedBid) {
      return res.status(400).json({
        message: "No accepted freelancer",
      });
    }

    /*
    ========================================
    PREVENT DUPLICATE REVIEWS
    ========================================
    */
    const existingReview = await prisma.review.findFirst({
      where: {
        projectId: Number(projectId),
        reviewerId: req.user.id,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this project",
      });
    }

    /*
    ========================================
    CREATE REVIEW
    ========================================
    */
    const review = await prisma.review.create({
      data: {
        projectId: Number(projectId),
        reviewerId: req.user.id,
        revieweeId: acceptedBid.freelancerId,
        rating: Number(rating),
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("REVIEW ERROR:", error);

    res.status(500).json({
      message: "Review failed",
      error: error.message,
    });
  }
};