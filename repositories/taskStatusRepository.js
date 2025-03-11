// Import the generated enum from Prisma Client
const { TaskStatus } = require("@prisma/client");

const getTaskStatuses = async () => {
  // Return an array of enum values
  return Object.values(TaskStatus);
};

module.exports = {
  getTaskStatuses,
};
