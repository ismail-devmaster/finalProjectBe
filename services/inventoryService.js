const inventoryRepository = require("../repositories/inventoryRepository");

const createInventory = async (data) => {
  return await inventoryRepository.createInventory(data);
};

const getAllInventories = async () => {
  return await inventoryRepository.getAllInventories();
};

const getInventoryById = async (id) => {
  return await inventoryRepository.getInventoryById(id);
};

const updateInventory = async (id, data) => {
  return await inventoryRepository.updateInventory(id, data);
};

const deleteInventory = async (id) => {
  return await inventoryRepository.deleteInventory(id);
};

const getLowInventories = async () => {
  return await inventoryRepository.getLowInventories();
};

const getInStockInventories = async () => {
  return await inventoryRepository.getInStockInventories();
};

const getOutOfStockInventories = async () => {
  return await inventoryRepository.getOutOfStockInventories();
};

module.exports = {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getLowInventories,
  getInStockInventories,
  getOutOfStockInventories,
};
