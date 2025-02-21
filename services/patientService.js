const patientRepository = require("../repositories/patientRepository");
const jwt = require("jsonwebtoken");

const getAllPatients = async () => {
  return await patientRepository.getAllPatients();
};

const getPatientById = async (id) => {
  return await patientRepository.getPatientById(id);
};

const getPatientId = async (userId) => {
  return await patientRepository.getPatientId(userId);
};


module.exports = { getAllPatients, getPatientById, getPatientId };
