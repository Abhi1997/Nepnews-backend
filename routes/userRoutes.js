// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

// Get all users (admin only)
router.get("/", auth, getAllUsers);

// Update user role (admin only)
router.put("/:userId/role", auth, updateUserRole);

module.exports = router;
