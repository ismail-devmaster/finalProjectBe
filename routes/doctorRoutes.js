const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { authenticatePatient, authenticateDoctor, authenticateReceptionist, authenticateAdmin } = require("../middlewares/authMiddleware");

router.get("/", authenticatePatient, doctorController.getAllDoctors);
router.get("/", authenticateDoctor, doctorController.getAllDoctors);
router.get("/", authenticateReceptionist, doctorController.getAllDoctors);
router.get("/", authenticateAdmin, doctorController.getAllDoctors);

router.get("/:id", authenticatePatient, doctorController.getDoctorById);
router.get("/:id", authenticateDoctor, doctorController.getDoctorById);
router.get("/:id", authenticateReceptionist, doctorController.getDoctorById);
router.get("/:id", authenticateAdmin, doctorController.getDoctorById);

module.exports = router;
