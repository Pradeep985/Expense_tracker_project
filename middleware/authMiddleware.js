const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    let token;
    console.log("token ",req.headers.authorization)
    // ✅ Only check the Authorization header (not cookies)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // console.log("Token:", token); // Debugging

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};
