const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { authenticateDoctor, authenticateReceptionist, authenticateAdmin } = require("../middlewares/authMiddleware");

router.get("/", authenticateDoctor, patientController.getAllPatients);
router.get("/", authenticateReceptionist, patientController.getAllPatients);
router.get("/", authenticateAdmin, patientController.getAllPatients);

router.get("/:id", authenticateDoctor, patientController.getPatientById);
router.get("/:id", authenticateReceptionist, patientController.getPatientById);
router.get("/:id", authenticateAdmin, patientController.getPatientById);


module.exports = router;
