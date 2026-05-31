const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    const decoded = jwt.verify(token, "secretkey123");

    req.user = decoded; // store user info
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
