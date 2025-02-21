const appointmentTypeService = require("../services/appointmentTypeService");

exports.getAllAppointmentTypes = async (req, res) => {
  try {
    const appointmentTypes =
      await appointmentTypeService.getAllAppointmentTypes();
    res.json({ appointmentTypes });
  } catch (error) {
    console.error("Error fetching appointment types:", error);
    res.status(500).json({ error: "Failed to fetch appointment types" });
  }
};

exports.getAppointmentTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentType = await appointmentTypeService.getAppointmentTypeById(
      id
    );
    if (!appointmentType) {
      return res.status(404).json({ error: "Appointment type not found" });
    }
    res.json({ appointmentType });
  } catch (error) {
    console.error("Error fetching appointment type by id:", error);
    res.status(500).json({ error: "Failed to fetch appointment type" });
  }
};
