const pool = require("../config/db");

// ===============================
// Add Application
// ===============================
const addApplication = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { company, role, status, user_id } = req.body;

    if (!company || !role || !user_id) {
      return res.status(400).json({
        message: "Company, Role and User ID are required",
      });
    }

    const newApplication = await pool.query(
      `INSERT INTO applications
      (company, role, status, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [company, role, status || "Applied", user_id],
    );

    res.status(201).json({
      message: "Application Added Successfully",
      application: newApplication.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Get All Applications
// ===============================
const getApplications = async (req, res) => {
  try {
    const applications = await pool.query(
      "SELECT * FROM applications ORDER BY id DESC",
    );

    res.status(200).json(applications.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Update Application Status
// ===============================
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedApplication = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id],
    );

    if (updatedApplication.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application Updated Successfully",
      application: updatedApplication.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Application
// ===============================
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApplication = await pool.query(
      "DELETE FROM applications WHERE id = $1 RETURNING *",
      [id],
    );

    if (deletedApplication.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  addApplication,
  getApplications,
  updateApplication,
  deleteApplication,
};
