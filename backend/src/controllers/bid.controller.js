const prisma = require("../utils/prisma");

/*
========================================
CREATE BID
========================================
*/
exports.createBid = async (req, res) => {
  try {
    const { projectId, proposal, bidAmount, estimatedDays } = req.body;

    const existingBid = await prisma.bid.findUnique({
      where: {
        projectId_freelancerId: {
          projectId: Number(projectId),
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
        projectId: Number(projectId),
        freelancerId: req.user.id,
        proposal,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
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

    await prisma.bid.update({
      where: { id: bidId },
      data: { status: "ACCEPTED" },
    });

    await prisma.bid.updateMany({
      where: {
        projectId: bid.projectId,
        id: { not: bidId },
      },
      data: { status: "REJECTED" },
    });

    await prisma.project.update({
      where: { id: bid.projectId },
      data: { status: "IN_PROGRESS" },
    });

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