const patientService = require("../services/patientService");

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await patientService.getAllPatients();
    res.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
};
exports.getPatientId = async (req, res) => {
  try {
    // req.user is assumed to be set by authenticatePatient middleware
    const result = await patientService.getPatientId(req.user.id);
    if (!result) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ patientId: result.userId });
  } catch (error) {
    console.error("Error fetching patient id:", error);
    res.status(500).json({ error: "Failed to retrieve patient id" });
  }
};
