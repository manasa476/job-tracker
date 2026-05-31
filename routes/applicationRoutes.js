const verifyToken = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET USER JOBS
router.get("/", async (req, res) => {
  try {
    const { user_email } = req.query;

    const result = await pool.query(
      "SELECT * FROM applications WHERE user_email = $1 ORDER BY id DESC",
      [user_email],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// ADD JOB
router.post("/", async (req, res) => {
  try {
    const { company, role, status, user_email } = req.body;

    const result = await pool.query(
      "INSERT INTO applications (company, role, status, user_email) VALUES ($1, $2, $3, $4) RETURNING *",
      [company, role, status, user_email],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding job" });
  }
});

// UPDATE STATUS
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating job" });
  }
});

// DELETE JOB
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM applications WHERE id = $1", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting job" });
  }
});

module.exports = router;
