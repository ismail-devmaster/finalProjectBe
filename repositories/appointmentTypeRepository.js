const prisma = require("../config/database");

const getAllAppointmentTypes = async () => {
  return await prisma.appointmentType.findMany();
};

const getAppointmentTypeById = async (id) => {
  return await prisma.appointmentType.findUnique({
    where: { id: Number(id) },
  });
};

module.exports = {
  getAllAppointmentTypes,
  getAppointmentTypeById,
};
