const patientRepository = require("../repositories/patientRepository");

const getAllPatients = async () => {
  return await patientRepository.getAllPatients();
};

const getPatientById = async (id) => {
  return await patientRepository.getPatientById(id);
};

module.exports = { getAllPatients, getPatientById };
