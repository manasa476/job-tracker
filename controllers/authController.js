const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, hashedPassword],
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
      },
      "secret123",
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login Successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};
