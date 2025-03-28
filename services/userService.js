const userRepository = require('../repositories/userRepository');

const getUsers = async () => {
  return await userRepository.getStaff();
};

const getReceptionists = async () => {
  return await userRepository.getReceptionist();
};

module.exports = { getUsers, getReceptionists };
