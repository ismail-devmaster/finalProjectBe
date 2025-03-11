// unitService.js

const unitRepository = require("../repositories/unitRepository");

const getInventoryUnits = async () => {
  return await unitRepository.getInventoryUnits();
};

module.exports = {
  getInventoryUnits,
};
