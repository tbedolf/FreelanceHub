const express = require("express");
const { listUsers, setUserActive } = require("../controllers/admin.controller");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireRole("ADMIN"));
router.get("/users", listUsers);
router.patch("/users/:id/status", setUserActive);
module.exports = router;
