const doctorService = require("../services/doctorService");

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};
