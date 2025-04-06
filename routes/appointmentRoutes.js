const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// GET /appointments - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.get(
  "/",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  appointmentController.getAllAppointments
);

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

// GET /appointments/patient/:patientId - allowed for PATIENT (own appointments), DOCTOR, RECEPTIONIST, ADMIN
router.get(
  "/patient/:patientId",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"),
  appointmentController.getAppointmentsByPatientId
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

// GET /appointments/doctor/:doctorId/patients – accessible by allowed roles
router.get(
  "/doctor/:doctorId/patients",
  authenticateUser,
  authorizeRoles("DOCTOR", "ADMIN", "PATIENT"),
  appointmentController.getPatientsByDoctorId
);

module.exports = router;
