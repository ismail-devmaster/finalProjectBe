const express = require("express");
const router = express.Router();
const appointmentTypeController = require("../controllers/appointmentTypeController");
const { authenticateAdmin, authenticateDoctor, authenticateReceptionist, authenticatePatient } = require("../middlewares/authMiddleware");

router.get("/", authenticateAdmin, appointmentTypeController.getAllAppointmentTypes);
router.get("/", authenticateDoctor, appointmentTypeController.getAllAppointmentTypes);
router.get("/", authenticateReceptionist, appointmentTypeController.getAllAppointmentTypes);
router.get("/", authenticatePatient, appointmentTypeController.getAllAppointmentTypes);

router.get("/:id", authenticateAdmin, appointmentTypeController.getAppointmentTypeById);
router.get("/:id", authenticateDoctor, appointmentTypeController.getAppointmentTypeById);
router.get("/:id", authenticateReceptionist, appointmentTypeController.getAppointmentTypeById);
router.get("/:id", authenticatePatient, appointmentTypeController.getAppointmentTypeById);

router.post("/", authenticateAdmin, appointmentTypeController.createAppointmentType);
router.put("/:id", authenticateAdmin, appointmentTypeController.updateAppointmentType);
router.delete("/:id", authenticateAdmin, appointmentTypeController.deleteAppointmentType);

module.exports = router;
