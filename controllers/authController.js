const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: "Error hashing password" });

      User.createUser(name, email, hash, (error, results) => {
          if (error) {
              if (error.message === "User already exists") {
                  return res.status(400).json({ error: "User already exists" });
              }
              return res.status(500).json({ error: "Database error" });
          }
          res.status(201).json({ message: "User registered successfully" });
      });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.getUserByEmail(email, (error, results) => {
      if (error) {
          return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              return res.status(500).json({ error: "Error comparing passwords" });
          }

          if (!isMatch) {
              return res.status(401).json({ error: "Incorrect password" });
          }

          res.json({
              message: "Login successful",
              user: { id: user.id, name: user.name, email: user.email }
          });
      });
  });
};
