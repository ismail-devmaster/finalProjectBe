const taskService = require("../services/taskService");

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.user.id);
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    // req.user.id is set by the authentication middleware
    const tasks = await taskService.getMyTasks(req.user.id);
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    res.status(500).json({ error: "Failed to fetch your tasks" });
  }
};

exports.getMyCompletedTasks = async (req, res) => {
  try {
    const tasks = await taskService.getMyCompletedTasks(req.user.id);
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching my completed tasks:", error);
    res.status(500).json({ error: "Failed to fetch your completed tasks" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(id, req.body);
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await taskService.deleteTask(id);
    res.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
