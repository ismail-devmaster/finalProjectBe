const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// GET /patients/id - only patients can get their own ID
router.get(
  "/id",
  authenticateUser,
  authorizeRoles("PATIENT"),
  patientController.getPatientId
);

// GET /patients - allowed for ADMIN, DOCTOR, and RECEPTIONIST roles
router.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  patientController.getAllPatients
);

// GET /patients/:id - allowed for ADMIN, DOCTOR, and RECEPTIONIST roles
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  patientController.getPatientById
);

module.exports = router;
