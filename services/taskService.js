const taskRepository = require("../repositories/taskRepository");

const createTask = async (data) => {
  // You can add validations here if needed.
  return await taskRepository.createTask(data);
};

const getAllTasks = async (userId) => {
  return await taskRepository.getAllTasks(userId);
};

const getMyTasks = async (userId) => {
  return await taskRepository.getMyTasks(userId);
};

const getMyCompletedTasks = async (userId) => {
  return await taskRepository.getMyCompletedTasks(userId);
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
  getMyTasks,
  getMyCompletedTasks,
  updateTask,
  deleteTask,
};
