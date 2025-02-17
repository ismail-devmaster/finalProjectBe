const adminRepository = require("../repositories/adminRepository");

const updateRole = async (userId, newRole) =>
  await adminRepository.updateUserRole(userId, newRole);

const deleteUser = async (userId) =>
  await adminRepository.deleteUserAndRelated(userId);

module.exports = { updateRole, deleteUser };
