// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authMiddleware = require("./middlewares/authMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const adRoutes = require("./routes/adRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to NepNews backend API");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
