const doctorRepository = require("../repositories/doctorRepository");

const getAllDoctors = async () => {
  return await doctorRepository.getAllDoctors();
};

const getDoctorById = async (id) => {
  return await doctorRepository.getDoctorById(id);
};

module.exports = { getAllDoctors, getDoctorById };
