const taskPriorityRepository = require("../repositories/taskPriorityRepository");

const getTaskPriorities = async () => {
  return await taskPriorityRepository.getTaskPriorities();
};

module.exports = {
  getTaskPriorities,
};
