// Import the generated enum from Prisma Client
const { InventoryUnit } = require("@prisma/client");

const getInventoryUnits = async () => {
  // Object.values returns the list of enum values (e.g., ["PCS", "BOXES", "SETS", "PACKS", "BOTTLES"])
  return Object.values(InventoryUnit);
};

module.exports = {
  getInventoryUnits,
};
