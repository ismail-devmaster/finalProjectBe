const userRepository = require('../repositories/userRepository');

const getUsers = async () => {
  return await userRepository.getStaff();
};

const getReceptionists = async () => {
  return await userRepository.getReceptionist();
};

const getReceptionistsAndDoctor = async (doctorId) => {
  return await userRepository.getReceptionistsAndDoctor(doctorId);
};

module.exports = { getUsers, getReceptionists, getReceptionistsAndDoctor };
