const express = require("express");
const router = express.Router();
const appointmentTypeController = require("../controllers/appointmentTypeController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// GET /appointment-types - allowed for RECEPTIONIST, PATIENT, DOCTOR, and ADMIN
router.get(
  "/",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentTypeController.getAllAppointmentTypes
);

// GET /appointment-types/:id - allowed for RECEPTIONIST, PATIENT, DOCTOR, and ADMIN
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentTypeController.getAppointmentTypeById
);

module.exports = router;
