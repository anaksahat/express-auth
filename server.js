const express = require("express");
const app = express();
const errorhandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const userRoutes = require("./routes/userRoutes");
const { BASE_URL, PORT } = require("./config/appConfig");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api/auth", authRoutes);

// HANYA USER YANG LOGIN BISA CRUD data users
app.use(authMiddleware);
app.use("/api/users", userRoutes);

// error handler execute at the end
app.use("/*", (req, res) =>
  res.status(404).json({
    error: "ERR NOT FOUND",
  })
);
app.use(errorhandler);

app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}:${PORT}`));
