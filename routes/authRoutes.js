const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// TEMP USERS (replace later with DB)
const users = [
  {
    email: "test@gmail.com",
    password: "1234",
  },
];

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, "secretkey123", {
    expiresIn: "1h",
  });

  res.json({
    token,
    email: user.email,
  });
});

module.exports = router;
