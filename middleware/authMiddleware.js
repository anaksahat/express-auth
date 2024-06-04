const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/appConfig");
const database = require("../model/database");

const authMiddleware = async (req, res, next) => {
  // AMBIL TOKEN DARI request headers
  console.log(req.headers?.authorization);
  const token = req.headers?.authorization?.split(" ")[1];

  if (token === null)
    return res.status(401).json({ message: "Unauthorized: Token missing" });

  try {
    // VERIFIKASI TOKENNYA
    const decodeToken = jwt.verify(token, SECRET, { algorithm: "HS256" });

    // CEK APAKAH ID USER ADA DI DATABASE
    const [user] = await database.query(`SELECT * FROM users WHERE id = ?`, [
      decodeToken.userId,
    ]);

    if (!user)
      return res.status(401).json({ message: "Unauthorized: User not found" });

    req.user;
    // NEXT ROUTE ATAU MIDDLEWARE
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
