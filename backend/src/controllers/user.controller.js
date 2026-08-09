const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
};

exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: safeUserSelect,
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = {};

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: "Name is required" });
      data.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) return res.status(400).json({ message: "Email is required" });
      const existing = await prisma.user.findFirst({
        where: { email: normalizedEmail, id: { not: req.user.id } },
      });
      if (existing) return res.status(409).json({ message: "Email is already in use" });
      data.email = normalizedEmail;
    }

    if (password !== undefined && password !== "") {
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: safeUserSelect,
    });
    return res.json(user);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
