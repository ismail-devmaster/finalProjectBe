const prisma = require("../config/database");

const updateUserRoleAndRelated = async (userId, newRole) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const currentRole = user.role;
  if (currentRole === newRole) {
    return user; // No change needed if roles are the same
  }

  // Delete the related record for the current role if it exists
  if (currentRole === "PATIENT") {
    await prisma.patient.delete({ where: { userId } }).catch(() => {});
  } else if (currentRole === "DOCTOR") {
    await prisma.doctor.delete({ where: { userId } }).catch(() => {});
  } else if (currentRole === "RECEPTIONIST") {
    await prisma.receptionist.delete({ where: { userId } }).catch(() => {});
  } else if (currentRole === "ADMIN") {
    await prisma.admin.delete({ where: { userId } }).catch(() => {});
  }

  // Update the user's role
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // Create the new related record based on the new role
  if (newRole === "PATIENT") {
    await prisma.patient.create({
      data: { userId, medicalHistory: "" }, // Add default values as needed
    });
  } else if (newRole === "DOCTOR") {
    await prisma.doctor.create({
      data: { userId },
    });
  } else if (newRole === "RECEPTIONIST") {
    await prisma.receptionist.create({
      data: { userId },
    });
  } else if (newRole === "ADMIN") {
    await prisma.admin.create({
      data: { userId },
    });
  }

  // Return the updated user record
  return await prisma.user.findUnique({ where: { id: userId } });
};

const deleteUserAndRelated = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  // Delete related records depending on user role
  if (user.role === "PATIENT") {
    const patientExists = await prisma.patient.findUnique({
      where: { userId },
    });
    if (patientExists) {
      await prisma.patient.delete({ where: { userId } });
    }
  } else if (user.role === "DOCTOR") {
    const doctorExists = await prisma.doctor.findUnique({ where: { userId } });
    if (doctorExists) {
      await prisma.doctor.delete({ where: { userId } });
    }
  } else if (user.role === "RECEPTIONIST") {
    const receptionistExists = await prisma.receptionist.findUnique({
      where: { userId },
    });
    if (receptionistExists) {
      await prisma.receptionist.delete({ where: { userId } });
    }
  }

  // Finally, delete the user itself
  return await prisma.user.delete({ where: { id: userId } });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: {
      role: {
        in: ["PATIENT", "DOCTOR", "RECEPTIONIST"],
      },
    },
    include: {
      patient: true,
      doctor: true,
      receptionist: true,
    },
  });
};

module.exports = {
  updateUserRoleAndRelated,
  deleteUserAndRelated,
  getAllUsers,
};
