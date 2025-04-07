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

const getReceptionistsAndDoctors = async () => {
  return await userRepository.getReceptionistsAndDoctors();
};

module.exports = { 
  getUsers, 
  getReceptionists, 
  getReceptionistsAndDoctor,
  getReceptionistsAndDoctors
};
