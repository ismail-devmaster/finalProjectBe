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

const getAppointmentsByPatientId = async (patientId) => {
  return await appointmentRepository.getAppointmentsByPatientId(patientId);
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

const getPatientsByDoctorId = async (doctorId) => {
  const appointments = await appointmentRepository.getAppointmentsByDoctorId(doctorId);
  
  // Extract and deduplicate patients
  const uniquePatients = new Map();
  appointments.forEach(appointment => {
    const patient = appointment.patient;
    if (!uniquePatients.has(patient.user.id)) {
      uniquePatients.set(patient.user.id, {
        ...patient.user,
        medicalHistory: patient.medicalHistory,
      });
    }
  });

  return Array.from(uniquePatients.values());
};

module.exports = {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  getAppointmentsByActionId,
  getAppointmentsWithWaitingStatus,
  getAppointmentsByDoctorId,
  getPatientsByDoctorId,
  getAppointmentsWithUpcomingStatus,
};
