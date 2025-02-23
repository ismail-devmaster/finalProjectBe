const appointmentService = require("../services/appointmentService");

exports.createAppointment = async (req, res) => {
  try {
    let appointmentData = req.body;
    // Auto-assign the patientId if the logged-in user is a patient,
    // or doctorId if the user is a doctor.
    if (req.user.role === "PATIENT") {
      appointmentData.patientId = req.user.id;
    }
    if (req.user.role === "DOCTOR") {
      appointmentData.doctorId = req.user.id;
    }
    const appointment = await appointmentService.createAppointment(
      appointmentData
    );
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.updateAppointment(
      req.params.id,
      req.body
    );
    res.json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await appointmentService.deleteAppointment(req.params.id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id
    );
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
    res.json({ appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

exports.getAppointmentByPatientId = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentByPatientId(
      req.params.id
    );
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
    res.json({ appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

exports.getAppointmentsByActionId = async (req, res) => {
  try {
    const { actionId } = req.params;
    const appointments = await appointmentService.getAppointmentsByActionId(
      actionId
    );
    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments by actionId:", error);
    res.status(500).json({ error: "Failed to fetch appointments by actionId" });
  }
};

exports.getAppointmentsWithWaitingStatus = async (req, res) => {
  try {
    const appointments =
      await appointmentService.getAppointmentsWithWaitingStatus();
    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching waiting appointments:", error);
    res.status(500).json({ error: "Failed to fetch waiting appointments" });
  }
};
