const express = require("express");
const app = express();
const errorhandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const articleRoutes = require("./routes/articleRoutes");
const placeRoutes = require("./routes/placeRoutes");

const { BASE_URL, PORT } = require("./config/appConfig");
const authRoutes = require("./routes/authRoutes");
//const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api/auth", authRoutes);

// HANYA USER YANG LOGIN BISA CRUD data users
// app.use(authMiddleware); // Temporarily disable authentication
app.use("/api/users", userRoutes);

// Mounting the routes
app.use("/api/item", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/place", placeRoutes);

// error handler execute at the end
app.use("/*", (req, res) =>
  res.status(404).json({
    error: "ERR NOT FOUND",
  })
);
app.use(errorhandler);

app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}:${PORT}`));
