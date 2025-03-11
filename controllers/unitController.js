// unitController.js

const unitService = require("../services/unitService");

exports.getInventoryUnits = async (req, res) => {
  try {
    const units = await unitService.getInventoryUnits();
    res.json({ units });
  } catch (error) {
    console.error("Error fetching inventory units:", error);
    res.status(500).json({ error: "Failed to fetch inventory units" });
  }
};
