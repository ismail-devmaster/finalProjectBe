const prisma = require("../config/database");

const updateUserRole = async (userId, newRole) =>
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

const deleteUserAndRelated = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  // Delete related records depending on user role
  if (user.role === "PATIENT") {
    await prisma.patient.delete({ where: { userId } });
  } else if (user.role === "DOCTOR") {
    await prisma.doctor.delete({ where: { userId } });
  } else if (user.role === "RECEPTIONIST") {
    await prisma.receptionist.delete({ where: { userId } });
  }
  return await prisma.user.delete({ where: { id: userId } });
};

module.exports = { updateUserRole, deleteUserAndRelated };
