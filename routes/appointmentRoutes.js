const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticatePatient, authenticateDoctor, authenticateReceptionist } = require("../middlewares/authMiddleware");

// POST /appointments
router.post("/", 
  authenticatePatient, appointmentController.createAppointment,
  authenticateDoctor, appointmentController.createAppointment,
  authenticateReceptionist, appointmentController.createAppointment,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// PUT /appointments/:id
router.put("/:id",
  authenticatePatient, appointmentController.updateAppointment,
  authenticateDoctor, appointmentController.updateAppointment,
  authenticateReceptionist, appointmentController.updateAppointment,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// DELETE /appointments/:id
router.delete("/:id",
  authenticatePatient, appointmentController.deleteAppointment,
  authenticateDoctor, appointmentController.deleteAppointment,
  authenticateReceptionist, appointmentController.deleteAppointment,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// GET /appointments
router.get("/",
  authenticatePatient, appointmentController.getAllAppointments,
  authenticateDoctor, appointmentController.getAllAppointments,
  authenticateReceptionist, appointmentController.getAllAppointments,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// GET /appointments/:id
router.get("/:id",
  authenticatePatient, appointmentController.getAppointmentById,
  authenticateDoctor, appointmentController.getAppointmentById,
  authenticateReceptionist, appointmentController.getAppointmentById,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

module.exports = router;
