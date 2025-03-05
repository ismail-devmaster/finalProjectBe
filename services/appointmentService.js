const appointmentRepository = require("../repositories/appointmentRepository");

const createAppointment = async (data) => {
  return await appointmentRepository.createAppointment(data);
};

const updateAppointment = async (id, updateData) => {
  return await appointmentRepository.updateAppointment(id, updateData);
};

const deleteAppointment = async (id) => {
  return await appointmentRepository.deleteAppointment(id);
};

const getAllAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.getAppointmentById(id);
};

const getAppointmentByPatientId = async (id) => {
  return await appointmentRepository.getAppointmentByPatientId(id);
};

const getAppointmentsByActionId = async (actionId) => {
  return await appointmentRepository.getAppointmentsByActionId(actionId);
};

const getAppointmentsWithWaitingStatus = async () => {
  return await appointmentRepository.getAppointmentsWithWaitingStatus();
};

const getAppointmentsWithUpcomingStatus = async () => {
  return await appointmentRepository.getAppointmentsWithUpcomingStatus();
};

const getAppointmentsByDoctorId = async (doctorId) => {
  return await appointmentRepository.getAppointmentsByDoctorId(doctorId);
};

module.exports = {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByPatientId,
  getAppointmentsByActionId,
  getAppointmentsWithWaitingStatus,
  getAppointmentsByDoctorId,
  getAppointmentsWithUpcomingStatus,
};
