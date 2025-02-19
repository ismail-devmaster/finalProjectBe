const prisma = require("../config/database");

const getAllPatients = async () => {
  return await prisma.patient.findMany({
    include: {
      appointments: true,
      payments: true,
      actions: true,
      queueEntries: true,
    },
  });
};

const getPatientById = async (id) => {
  return await prisma.patient.findUnique({
    where: { id: Number(id) },
    include: {
      appointments: true,
      payments: true,
      actions: true,
      queueEntries: true,
    },
  });
};

module.exports = { getAllPatients, getPatientById };
