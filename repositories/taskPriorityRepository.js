const { TaskPriority } = require("@prisma/client");

const getTaskPriorities = async () => {
  return Object.values(TaskPriority);
};

module.exports = {
  getTaskPriorities,
};
