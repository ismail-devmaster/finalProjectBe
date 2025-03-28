const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get(
  "/staff",
  authenticateUser,
  authorizeRoles("DOCTOR", "RECEPTIONIST", "ADMIN"),
  userController.getUsersController
);

router.get(
  "/receptionists",
  authenticateUser,
  authorizeRoles("DOCTOR", "RECEPTIONIST", "ADMIN"),
  userController.getReceptionistsController
);

module.exports = router;
