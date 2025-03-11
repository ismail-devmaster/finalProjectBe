const categoryRepository = require("../repositories/categoryRepository");

const createCategory = async (data) => {
  return await categoryRepository.createCategory(data);
};

const getAllCategories = async () => {
  return await categoryRepository.getAllCategories();
};

const getCategoryById = async (id) => {
  return await categoryRepository.getCategoryById(id);
};

const updateCategory = async (id, data) => {
  return await categoryRepository.updateCategory(id, data);
};

const deleteCategory = async (id) => {
  return await categoryRepository.deleteCategory(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
