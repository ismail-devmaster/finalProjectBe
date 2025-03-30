const categoryRepository = require("../repositories/categoryRepository");

const getAllCategories = async () => {
  return await categoryRepository.getAllCategories();
};

module.exports = {
  getAllCategories
};
