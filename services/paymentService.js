const paymentRepository = require("../repositories/paymentRepository");

const createPayment = async (data) => {
  return await paymentRepository.createPayment(data);
};

const getAllPayments = async () => {
  return await paymentRepository.getAllPayments();
};

const getPaymentById = async (id) => {
  return await paymentRepository.getPaymentById(id);
};

const updatePayment = async (id, updateData) => {
  return await paymentRepository.updatePayment(id, updateData);
};

const deletePayment = async (id) => {
  return await paymentRepository.deletePayment(id);
};

const getPaymentsByActionId = async (actionId) => {
  return await paymentRepository.getPaymentsByActionId(actionId);
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByActionId,
};
