const prisma = require("../config/database");

const createAppointment = async (data) => {
  return await prisma.appointment.create({ data });
};

const updateAppointment = async (id, updateData) => {
  return await prisma.appointment.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteAppointment = async (id) => {
  return await prisma.appointment.delete({
    where: { id: Number(id) },
  });
};

const getAllAppointments = async () => {
  return await prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
      status: true,
      type: true,
      action: true,
      queueEntries: true,
    },
  });
};

const getAppointmentById = async (id) => {
  return await prisma.appointment.findUnique({
    where: { id: Number(id) },
    include: {
      doctor: true,
      patient: true,
      status: true,
      type: true,
      action: true,
      queueEntries: true,
    },
  });
};

const getAppointmentByPatientId = async (id) => {
  return await prisma.appointment.findUnique({
    where: { patientId: Number(id) },
    include: {
      doctor: true,
      patient: true,
      status: true,
      type: true,
      action: true,
      queueEntries: true,
    },
  });
};

module.exports = {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByPatientId,
};
