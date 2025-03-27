const userRepository = require('../repositories/userRepository');

const getUsers = async () => {
  return await userRepository.getStaff();
};

module.exports = { getUsers };
