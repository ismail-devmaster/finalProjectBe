const express = require("express");
const router = express.Router();
const appointmentTypeController = require("../controllers/appointmentTypeController");
const {
  authenticateAdmin,
  authenticateDoctor,
  authenticateReceptionist,
  authenticatePatient,
} = require("../middlewares/authMiddleware");

// Endpoint to get all appointment types

router.get(
  "/",
  authenticatePatient,
  appointmentTypeController.getAllAppointmentTypes
);
router.get(
  "/",
  authenticateDoctor,
  appointmentTypeController.getAllAppointmentTypes
);
router.get(
  "/",
  authenticateReceptionist,
  appointmentTypeController.getAllAppointmentTypes
);
router.get(
  "/",
  authenticateAdmin,
  appointmentTypeController.getAllAppointmentTypes
);

// Endpoint to get a specific appointment type by id
router.get(
  "/:id",
  authenticatePatient,
  appointmentTypeController.getAppointmentTypeById
);
router.get(
  "/:id",
  authenticateDoctor,
  appointmentTypeController.getAppointmentTypeById
);
router.get(
  "/:id",
  authenticateReceptionist,
  appointmentTypeController.getAppointmentTypeById
);
router.get(
  "/:id",
  authenticateAdmin,
  appointmentTypeController.getAppointmentTypeById
);

module.exports = router;
