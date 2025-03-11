const taskRepository = require("../repositories/taskRepository");

const createTask = async (data) => {
  // You can add validations here if needed.
  return await taskRepository.createTask(data);
};

const getAllTasks = async () => {
  return await taskRepository.getAllTasks();
};

const getTaskById = async (id) => {
  return await taskRepository.getTaskById(id);
};

const updateTask = async (id, data) => {
  return await taskRepository.updateTask(id, data);
};

const deleteTask = async (id) => {
  return await taskRepository.deleteTask(id);
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
