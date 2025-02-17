const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const prisma = require("../config/database");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin };
