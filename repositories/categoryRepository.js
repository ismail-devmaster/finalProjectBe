const { CategoryEnum } = require("@prisma/client");

const getAllCategories = async () => {
  return Object.values(CategoryEnum);
};

module.exports = {
  getAllCategories
};
