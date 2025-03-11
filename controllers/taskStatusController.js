const taskStatusService = require("../services/taskStatusService");

exports.getTaskStatuses = async (req, res) => {
  try {
    const statuses = await taskStatusService.getTaskStatuses();
    res.json({ statuses });
  } catch (error) {
    console.error("Error fetching task statuses:", error);
    res.status(500).json({ error: "Failed to fetch task statuses" });
  }
};
