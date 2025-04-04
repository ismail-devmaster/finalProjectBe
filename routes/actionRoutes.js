const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// GET /actions - allowed for PATIENT, DOCTOR, and RECEPTIONIST
router.get(
  "/",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"),
  actionController.getAllActions
);
// POST /actions - allowed for PATIENT and DOCTOR
router.post(
  "/",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "ADMIN"),
  actionController.createAction
);

// GET /actions/:id - allowed for PATIENT, DOCTOR, and RECEPTIONIST
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"),
  actionController.getActionById
);

// GET /actions/patient/:patientId - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.get(
  "/patient/:patientId",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR", "ADMIN"),
  actionController.getActionsByPatientId
);

// PUT /actions/:id - allowed for PATIENT and DOCTOR
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "ADMIN"),
  actionController.updateAction
);

// DELETE /actions/:id - allowed for PATIENT and DOCTOR
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "ADMIN"),
  actionController.deleteAction
);

module.exports = router;
