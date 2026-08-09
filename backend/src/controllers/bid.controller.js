const prisma = require("../utils/prisma");

/*
========================================
CREATE BID
========================================
*/
exports.createBid = async (req, res) => {
  try {
    const { projectId, proposal, bidAmount, estimatedDays } = req.body;

    const numericProjectId = Number(projectId);
    const numericBidAmount = Number(bidAmount);
    const numericEstimatedDays = Number(estimatedDays);

    if (!Number.isInteger(numericProjectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!proposal?.trim()) {
      return res.status(400).json({ message: "Proposal is required" });
    }

    if (!Number.isFinite(numericBidAmount) || numericBidAmount <= 0) {
      return res.status(400).json({
        message: "Bid amount must be greater than zero",
      });
    }

    if (!Number.isInteger(numericEstimatedDays) || numericEstimatedDays <= 0) {
      return res.status(400).json({
        message: "Estimated days must be a positive integer",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: numericProjectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "OPEN") {
      return res.status(400).json({
        message: "This project is no longer accepting bids",
      });
    }

    if (project.clientId === req.user.id) {
      return res.status(403).json({
        message: "You cannot bid on your own project",
      });
    }

    const existingBid = await prisma.bid.findUnique({
      where: {
        projectId_freelancerId: {
          projectId: numericProjectId,
          freelancerId: req.user.id,
        },
      },
    });

    if (existingBid) {
      return res.status(400).json({
        message: "You have already bid on this project",
      });
    }

    const bid = await prisma.bid.create({
      data: {
        projectId: numericProjectId,
        freelancerId: req.user.id,
        proposal: proposal.trim(),
        bidAmount: numericBidAmount,
        estimatedDays: numericEstimatedDays,
      },
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error("BID CREATE ERROR:", error);

    res.status(500).json({
      message: "Bid creation failed",
      error: error.message,
    });
  }
};

/*
========================================
ACCEPT BID
========================================
*/
exports.acceptBid = async (req, res) => {
  try {
    const bidId = Number(req.params.id);

    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { project: true },
    });

    if (!bid) {
      return res.status(404).json({
        message: "Bid not found",
      });
    }

    if (bid.project.clientId !== req.user.id) {
      return res.status(403).json({
        message: "You can only accept bids on your own project",
      });
    }

    if (bid.project.status !== "OPEN") {
      return res.status(400).json({
        message: "This project already has an accepted bid",
      });
    }

    await prisma.$transaction([
      prisma.bid.update({
        where: { id: bidId },
        data: { status: "ACCEPTED" },
      }),
      prisma.bid.updateMany({
        where: { projectId: bid.projectId, id: { not: bidId } },
        data: { status: "REJECTED" },
      }),
      prisma.project.update({
        where: { id: bid.projectId },
        data: { status: "IN_PROGRESS" },
      }),
    ]);

    res.json({
      message: "Bid accepted successfully",
    });
  } catch (error) {
    console.error("ACCEPT BID ERROR:", error);

    res.status(500).json({
      message: "Failed to accept bid",
      error: error.message,
    });
  }
};

exports.getMyBids = async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { freelancerId: req.user.id },
      include: {
        project: {
          select: { id: true, title: true, status: true, budgetMin: true, budgetMax: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(bids);
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve bids" });
  }
};

exports.rejectBid = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid bid ID" });

  const bid = await prisma.bid.findUnique({
    where: { id },
    include: { project: true },
  });
  if (!bid) return res.status(404).json({ message: "Bid not found" });
  if (req.user.role !== "ADMIN" && bid.project.clientId !== req.user.id) {
    return res.status(403).json({ message: "You can only reject bids on your project" });
  }
  if (bid.status !== "PENDING" || bid.project.status !== "OPEN") {
    return res.status(400).json({ message: "Only pending bids on open projects can be rejected" });
  }

  const updated = await prisma.bid.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  return res.json(updated);
};
