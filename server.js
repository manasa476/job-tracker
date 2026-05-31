require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Test
pool
  .connect()
  .then(() => {
    console.log("PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.log("Database Error:", err.message);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Job Tracker API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
