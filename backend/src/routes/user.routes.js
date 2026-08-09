const express = require("express");
const { getProfile, updateProfile } = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.get("/me", requireAuth, getProfile);
router.put("/me", requireAuth, updateProfile);
module.exports = router;
