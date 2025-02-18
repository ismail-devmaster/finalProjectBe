const prisma = require("../config/database");

const getAllAppointmentTypes = async () => {
  return await prisma.appointmentType.findMany();
};

const getAppointmentTypeById = async (id) => {
  return await prisma.appointmentType.findUnique({
    where: { id: Number(id) },
  });
};

const createAppointmentType = async (data) => {
  return await prisma.appointmentType.create({ data });
};

const updateAppointmentType = async (id, updateData) => {
  return await prisma.appointmentType.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteAppointmentType = async (id) => {
  return await prisma.appointmentType.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  getAllAppointmentTypes,
  getAppointmentTypeById,
  createAppointmentType,
  updateAppointmentType,
  deleteAppointmentType,
};
