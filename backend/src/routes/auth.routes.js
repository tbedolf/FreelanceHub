const express = require("express");

const {
  register,
  login,
} = require("../controllers/auth.controller");

console.log("AUTH ROUTES LOADED");

const router = express.Router();

/*
========================================
REGISTER
========================================
*/
router.post("/register", register);

/*
========================================
LOGIN
========================================
*/
router.post("/login", login);

module.exports = router;