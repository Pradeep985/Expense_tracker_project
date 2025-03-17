const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public")); // Serve static files from the public folder

// Serve the login page


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "pages", "login.html"));
});

// Serve the signup page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "pages", "signup.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
