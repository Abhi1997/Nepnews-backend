// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Public routes can skip this if needed
  if (
    req.method === "GET" && 
    (req.path.startsWith("/articles") || req.path.startsWith("/ads")) 
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
