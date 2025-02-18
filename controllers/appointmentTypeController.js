const appointmentTypeService = require("../services/appointmentTypeService");

exports.getAllAppointmentTypes = async (req, res) => {
  try {
    const types = await appointmentTypeService.getAllAppointmentTypes();
    res.json({ appointmentTypes: types });
  } catch (error) {
    console.error("Error fetching appointment types:", error);
    res.status(500).json({ error: "Failed to fetch appointment types" });
  }
};

exports.getAppointmentTypeById = async (req, res) => {
  try {
    const type = await appointmentTypeService.getAppointmentTypeById(req.params.id);
    if (!type) {
      return res.status(404).json({ error: "Appointment type not found" });
    }
    res.json({ appointmentType: type });
  } catch (error) {
    console.error("Error fetching appointment type:", error);
    res.status(500).json({ error: "Failed to fetch appointment type" });
  }
};

exports.createAppointmentType = async (req, res) => {
  try {
    const newType = await appointmentTypeService.createAppointmentType(req.body);
    res.status(201).json({ message: "Appointment type created", appointmentType: newType });
  } catch (error) {
    console.error("Error creating appointment type:", error);
    res.status(500).json({ error: "Failed to create appointment type" });
  }
};

exports.updateAppointmentType = async (req, res) => {
  try {
    const updatedType = await appointmentTypeService.updateAppointmentType(req.params.id, req.body);
    res.json({ message: "Appointment type updated", appointmentType: updatedType });
  } catch (error) {
    console.error("Error updating appointment type:", error);
    res.status(500).json({ error: "Failed to update appointment type" });
  }
};

exports.deleteAppointmentType = async (req, res) => {
  try {
    await appointmentTypeService.deleteAppointmentType(req.params.id);
    res.json({ message: "Appointment type deleted" });
  } catch (error) {
    console.error("Error deleting appointment type:", error);
    res.status(500).json({ error: "Failed to delete appointment type" });
  }
};
