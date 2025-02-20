const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const {
  authenticatePatient,
  authenticateDoctor,
  authenticateReceptionist,
  authenticateAdmin,
  authenticateUser,
} = require("../middlewares/authMiddleware");

router.get("/", patientController.getAllPatients);
router.get("/", authenticateDoctor, patientController.getAllPatients);
router.get("/", authenticateReceptionist, patientController.getAllPatients);
router.get("/", authenticateAdmin, patientController.getAllPatients);

router.get("/:id", patientController.getPatientById);
router.get("/:id", authenticateDoctor, patientController.getPatientById);
router.get("/:id", authenticateReceptionist, patientController.getPatientById);
router.get("/:id", authenticateAdmin, patientController.getPatientById);

module.exports = router;
