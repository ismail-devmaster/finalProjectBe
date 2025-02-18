const adminRepository = require("../repositories/adminRepository");

const updateRole = async (userId, newRole) =>
  await adminRepository.updateUserRoleAndRelated(userId, newRole);

const deleteUser = async (userId) =>
  await adminRepository.deleteUserAndRelated(userId);

const getAllPatients = async () => {
  return await adminRepository.getAllPatients();
};

const getAllDoctors = async () => {
  return await adminRepository.getAllDoctors();
};

const getAllReceptionists = async () => {
  return await adminRepository.getAllReceptionists();
};

const getAllUsers = async () => {
  return await adminRepository.getAllUsers();
};

module.exports = {
  updateRole,
  deleteUser,
  getAllPatients,
  getAllDoctors,
  getAllReceptionists,
  getAllUsers,
};
