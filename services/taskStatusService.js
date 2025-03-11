const taskStatusRepository = require("../repositories/taskStatusRepository");

const getTaskStatuses = async () => {
  return await taskStatusRepository.getTaskStatuses();
};

module.exports = {
  getTaskStatuses,
};
