const prisma = require("../utils/prisma");

exports.createReview = async (req, res) => {
  try {
    const projectId = Number(req.body.projectId);
    const rating = Number(req.body.rating);
    const comment = req.body.comment?.trim() || null;

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { bids: { where: { status: "ACCEPTED" } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "COMPLETED") {
      return res.status(400).json({
        message: "Reviews can only be submitted after project completion",
      });
    }

    const acceptedBid = project.bids[0];
    if (!acceptedBid) {
      return res.status(400).json({
        message: "This project does not have an accepted freelancer",
      });
    }

    let revieweeId;
    if (req.user.id === project.clientId) {
      revieweeId = acceptedBid.freelancerId;
    } else if (req.user.id === acceptedBid.freelancerId) {
      revieweeId = project.clientId;
    } else {
      return res.status(403).json({
        message: "You did not participate in this project",
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        projectId_reviewerId: { projectId, reviewerId: req.user.id },
      },
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this project",
      });
    }

    const review = await prisma.review.create({
      data: {
        projectId,
        reviewerId: req.user.id,
        revieweeId,
        rating,
        comment,
      },
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    return res.status(500).json({ message: "Failed to create review" });
  }
};

exports.getProjectReviews = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    if (!Number.isInteger(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const reviews = await prisma.review.findMany({
      where: { projectId },
      include: {
        reviewer: { select: { id: true, name: true, role: true } },
        reviewee: { select: { id: true, name: true, role: true } },
      },
    });

    return res.json(reviews);
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    return res.status(500).json({ message: "Failed to retrieve reviews" });
  }
};
