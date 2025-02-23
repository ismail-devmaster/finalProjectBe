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

const authenticatePatient = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({ error: "Patient access required" });
    }
    next();
  });
};

const authenticateDoctor = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({ error: "Doctor access required" });
    }
    next();
  });
};

const authenticateReceptionist = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== "RECEPTIONIST") {
      return res.status(403).json({ error: "Receptionist access required" });
    }
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: "Access denied" });
  };
};
module.exports = {
  authenticateUser,
  authenticateAdmin,
  authenticatePatient,
  authenticateDoctor,
  authenticateReceptionist,
  authorizeRoles,
};
