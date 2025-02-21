const appointmentTypeRepository = require("../repositories/appointmentTypeRepository");

const getAllAppointmentTypes = async () => {
  return await appointmentTypeRepository.getAllAppointmentTypes();
};

const getAppointmentTypeById = async (id) => {
  return await appointmentTypeRepository.getAppointmentTypeById(id);
};

module.exports = {
  getAllAppointmentTypes,
  getAppointmentTypeById,
};
