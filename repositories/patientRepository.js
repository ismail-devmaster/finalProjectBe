const prisma = require("../config/database");

const getAllPatients = async () => {
  return await prisma.patient.findMany({
    include: {
      sex: true,
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
      sex: true,
      appointments: true,
      payments: true,
      actions: true,
      queueEntries: true,
    },
  });
};

module.exports = { getAllPatients, getPatientById };
