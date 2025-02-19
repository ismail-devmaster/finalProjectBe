const prisma = require("../config/database");

const createPayment = async (data) => {
  return await prisma.payment.create({ data });
};

const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      doctor: true,
      patient: true,
      status: true,
      action: true,
    },
  });
};

const getPaymentById = async (id) => {
  return await prisma.payment.findUnique({
    where: { id: Number(id) },
    include: {
      doctor: true,
      patient: true,
      status: true,
      action: true,
    },
  });
};

const updatePayment = async (id, updateData) => {
  return await prisma.payment.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deletePayment = async (id) => {
  return await prisma.payment.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
