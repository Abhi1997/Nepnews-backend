// controllers/userController.js
const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { userId } = req.params;
    const { newRole } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = newRole;
    await user.save();

    res.json({ msg: "User role updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
