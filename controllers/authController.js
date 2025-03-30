const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    User.getUserByEmail(email, async (error, results) => {
      if (error) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      User.createUser(name, email, hashedPassword, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
const login = (req, res) => {
  const { email, password } = req.body;

  User.getUserByEmail(email, (error, results) => {
    if (error) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Error comparing passwords" });
      if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
    });
  });
};

// ✅ Correct Export
module.exports = { register, login };
