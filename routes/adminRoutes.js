const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// All admin routes require ADMIN role
router.get(
  "/verify",
  authenticateUser,
  authorizeRoles("ADMIN"),
  adminController.verifyAdmin
);
router.put(
  "/update-role",
  authenticateUser,
  authorizeRoles("ADMIN"),
  adminController.updateRole
);
router.delete("/user/:id", adminController.deleteUser);
router.delete(
  "/user/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  adminController.deleteUser
);
router.get(
  "/users",
  authenticateUser,
  authorizeRoles("ADMIN"),
  adminController.getAllUsers
);

module.exports = router;
