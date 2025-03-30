const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the Dashboard!", user: req.user });
});

router.post('/signup', authController.register); // ✅ Corrected function name
router.post('/login', authController.login);

module.exports = router;
