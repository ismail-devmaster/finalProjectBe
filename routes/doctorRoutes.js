const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// GET /doctors - allowed for RECEPTIONIST, PATIENT, DOCTOR, and ADMIN
router.get(
  "/",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  doctorController.getAllDoctors
);

// GET /doctors/:id - allowed for RECEPTIONIST, PATIENT, DOCTOR, and ADMIN
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  doctorController.getDoctorById
);

module.exports = router;
