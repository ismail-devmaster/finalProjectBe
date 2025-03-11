const taskPriorityService = require("../services/taskPriorityService");

exports.getTaskPriorities = async (req, res) => {
  try {
    const priorities = await taskPriorityService.getTaskPriorities();
    res.json({ priorities });
  } catch (error) {
    console.error("Error fetching task priorities:", error);
    res.status(500).json({ error: "Failed to fetch task priorities" });
  }
};
