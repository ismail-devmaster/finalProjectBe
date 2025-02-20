const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const {
  authenticatePatient,
  authenticateDoctor,
  authenticateReceptionist,
} = require("../middlewares/authMiddleware");

// POST /appointments
router.post("/", authenticatePatient, appointmentController.createAppointment);
router.post("/", authenticateDoctor, appointmentController.createAppointment);
router.post(
  "/",
  authenticateReceptionist,
  appointmentController.createAppointment
);

// PUT /appointments/:id
router.put("/:id", appointmentController.updateAppointment);
router.put(
  "/:id",
  authenticatePatient,
  appointmentController.updateAppointment
);
router.put("/:id", authenticateDoctor, appointmentController.updateAppointment);
router.put(
  "/:id",
  authenticateReceptionist,
  appointmentController.updateAppointment
);

// DELETE /appointments/:id
router.delete(
  "/:id",
  authenticatePatient,
  appointmentController.deleteAppointment
);
router.delete(
  "/:id",
  authenticateDoctor,
  appointmentController.deleteAppointment
);
router.delete(
  "/:id",
  authenticateReceptionist,
  appointmentController.deleteAppointment
);

// GET /appointments
router.get("/", authenticatePatient, appointmentController.getAllAppointments);
router.get("/", authenticateDoctor, appointmentController.getAllAppointments);
router.get(
  "/",
  authenticateReceptionist,
  appointmentController.getAllAppointments
);

// GET /appointments/:id
router.get(
  "/:id",
  authenticatePatient,
  appointmentController.getAppointmentById
);
router.get(
  "/:id",
  authenticateDoctor,
  appointmentController.getAppointmentById
);
router.get(
  "/:id",
  authenticateReceptionist,
  appointmentController.getAppointmentById
);

// New endpoint: Get all appointments by actionId
router.get(
  "/action/:actionId",
  authenticatePatient,
  appointmentController.getAppointmentsByActionId
);
router.get(
  "/action/:actionId",
  authenticateDoctor,
  appointmentController.getAppointmentsByActionId
);
router.get(
  "/action/:actionId",
  authenticateReceptionist,
  appointmentController.getAppointmentsByActionId
);

module.exports = router;
