const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const cookieParser = require("cookie-parser"); // ✅ Required to read cookies
app.use(cookieParser());
app.use('/auth', authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/dashboard", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "pages", "dashboard.html"));
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "pages", "login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "pages", "signup.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
