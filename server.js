// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();

// Database connection
connectDB();
app.use("/ad", require("./routes/adRoutes"));
// Middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to NepNews backend API");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
