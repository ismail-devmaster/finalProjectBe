const adminRepository = require("../repositories/adminRepository");

const updateRole = async (userId, newRole) =>
  await adminRepository.updateUserRoleAndRelated(userId, newRole);

const deleteUser = async (userId) =>
  await adminRepository.deleteUserAndRelated(userId);

const getAllUsers = async () => {
  return await adminRepository.getAllUsers();
};

module.exports = {
  updateRole,
  deleteUser,
  getAllUsers,
};
