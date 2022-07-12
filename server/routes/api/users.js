const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

const userController = require("../../controllers/userController");

// POST /api/users/register
router.post("/register", userController.createUser);

// POST /api/users/login
router.post("/login", userController.loginUser);

module.exports = router;
