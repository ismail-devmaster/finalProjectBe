const actionRepository = require("../repositories/actionRepository");

const createAction = async (data) => {
  return await actionRepository.createAction(data);
};

const getAllActions = async () => {
  return await actionRepository.getAllActions();
};

const getActionById = async (id) => {
  return await actionRepository.getActionById(id);
};

const updateAction = async (id, updateData) => {
  return await actionRepository.updateAction(id, updateData);
};

const deleteAction = async (id) => {
  return await actionRepository.deleteAction(id);
};

module.exports = {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction,
};
