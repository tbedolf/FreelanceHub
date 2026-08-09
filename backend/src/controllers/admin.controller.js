const prisma = require("../utils/prisma");

exports.listUsers = async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users);
};

exports.setUserActive = async (req, res) => {
  const id = Number(req.params.id);
  const { isActive } = req.body;
  if (!Number.isInteger(id) || typeof isActive !== "boolean") {
    return res.status(400).json({ message: "Valid user ID and isActive are required" });
  }
  if (id === req.user.id && !isActive) {
    return res.status(400).json({ message: "Administrators cannot disable themselves" });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    return res.json(user);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "User not found" });
    return res.status(500).json({ message: "Failed to update user" });
  }
};
