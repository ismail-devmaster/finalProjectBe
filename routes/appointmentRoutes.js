const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// GET /appointments/waiting - allowed for RECEPTIONIST, PATIENT, DOCTOR
router.get(
  "/waiting",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentController.getAppointmentsWithWaitingStatus
);

// GET /appointments/upcoming - allowed for RECEPTIONIST, PATIENT, DOCTOR
router.get(
  "/upcoming",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentController.getAppointmentsWithUpcomingStatus
);

// POST /appointments - allowed for RECEPTIONIST, DOCTOR, and PATIENT
router.post(
  "/",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "DOCTOR", "PATIENT"),
  appointmentController.createAppointment
);

// PUT /appointments/:id - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR"),
  appointmentController.updateAppointment
);

// DELETE /appointments/:id - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR"),
  appointmentController.deleteAppointment
);

// GET /appointments - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.get(
  "/",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentController.getAllAppointments
);

// GET /appointments/:id - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentController.getAppointmentById
);

// GET /appointments/action/:actionId - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.get(
  "/action/:actionId",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentController.getAppointmentsByActionId
);

// GET /appointments/doctor/:doctorId – accessible by allowed roles
router.get(
  "/doctor/:doctorId",
  authenticateUser,
  authorizeRoles("DOCTOR", "ADMIN", "PATIENT"),
  appointmentController.getAppointmentsByDoctorId
);

module.exports = router;
