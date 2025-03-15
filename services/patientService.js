const patientRepository = require("../repositories/patientRepository");
const jwt = require("jsonwebtoken");

const getAllPatients = async () => {
  return await patientRepository.getAllPatients();
};

const getPatientDataById = async (userId) => {
  return await patientRepository.getPatientDataById(userId);
};

const getPatientData = async (userId) => {
  return await patientRepository.getPatientData(userId);
};

const getPatientId = async (userId) => {
  return await patientRepository.getPatientId(userId);
};

module.exports = {
  getAllPatients,
  getPatientDataById,
  getPatientId,
  getPatientData,
};
