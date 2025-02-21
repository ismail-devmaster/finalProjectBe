const prisma = require("../config/database");

const createAppointment = async (data) => {
  if (data.date && data.time) {
    const appointmentDate = new Date(data.date);
    appointmentDate.setHours(0, 0, 0, 0); // Reset the time to midnight

    let appointmentTime = new Date(appointmentDate);
    const [hours, minutes] = data.time.split(":"); // Assuming time is in "HH:mm" format
    appointmentTime.setHours(hours, minutes, 0, 0);

    data.date = appointmentDate;
    data.time = appointmentTime;
  }
  return await prisma.appointment.create({ data });
};

const updateAppointment = async (id, updateData) => {
  if (updateData.date && updateData.time) {
    const appointmentDate = new Date(updateData.date);
    appointmentDate.setHours(0, 0, 0, 0); // Reset the time to midnight

    let appointmentTime = new Date(appointmentDate);
    const [hours, minutes] = updateData.time.split(":"); // Assuming time is in "HH:mm" format
    appointmentTime.setHours(hours, minutes, 0, 0);

    updateData.date = appointmentDate;
    updateData.time = appointmentTime;
  }
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
      action: true,
      queueEntries: true,
    },
  });
};
const getAppointmentsByActionId = async (actionId) => {
  return await prisma.appointment.findMany({
    where: { actionId: Number(actionId) },
    include: {
      doctor: true,
      patient: true,
      status: true,
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
  getAppointmentsByActionId,
};
