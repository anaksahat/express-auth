const express = require("express");
const app = express();
const errorhanlder = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const userRoutes = require("./routes/userRoutes");
const { BASE_URL, PORT } = require("./config/appConfig");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(errorhanlder);
app.use(logger);
app.use("/api/auth", authRoutes);

// HANYA USER YANG LOGIN BISA CRUD data users
// app.use(authMiddleware);
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}:${PORT}`));
