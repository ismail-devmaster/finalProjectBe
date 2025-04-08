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
router.get(
  "/data",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"),
  userController.getUserDataController
);
router.get(
  "/receptionists-and-doctor/:doctorId",
  authenticateUser,
  authorizeRoles("DOCTOR", "RECEPTIONIST", "ADMIN"),
  userController.getReceptionistsAndDoctorController
);

router.get(
  "/receptionists-and-doctors",
  authenticateUser,
  authorizeRoles("DOCTOR", "RECEPTIONIST", "ADMIN"),
  userController.getReceptionistsAndDoctorsController
);

module.exports = router;
