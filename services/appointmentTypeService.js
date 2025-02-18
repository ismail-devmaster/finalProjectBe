const appointmentTypeRepository = require("../repositories/appointmentTypeRepository");

const getAllAppointmentTypes = async () => {
  return await appointmentTypeRepository.getAllAppointmentTypes();
};

const getAppointmentTypeById = async (id) => {
  return await appointmentTypeRepository.getAppointmentTypeById(id);
};

const createAppointmentType = async (data) => {
  return await appointmentTypeRepository.createAppointmentType(data);
};

const updateAppointmentType = async (id, updateData) => {
  return await appointmentTypeRepository.updateAppointmentType(id, updateData);
};

const deleteAppointmentType = async (id) => {
  return await appointmentTypeRepository.deleteAppointmentType(id);
};

module.exports = {
  getAllAppointmentTypes,
  getAppointmentTypeById,
  createAppointmentType,
  updateAppointmentType,
  deleteAppointmentType,
};
