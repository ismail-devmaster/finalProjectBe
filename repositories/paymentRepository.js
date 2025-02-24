const prisma = require("../config/database");

const createPayment = async (data) => {
  if (data.date && data.time) {
    const paymentDate = new Date(data.date);
    paymentDate.setHours(0, 0, 0, 0); // Reset the time to midnight

    let paymentTime = new Date(paymentDate);
    const [hours, minutes] = data.time.split(":"); // Assuming time is in "HH:mm" format
    paymentTime.setHours(hours, minutes, 0, 0);

    data.date = paymentDate;
    data.time = paymentTime;
  }
  return await prisma.payment.create({ data });
};

const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      doctor: {
        select: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
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
      doctor: {
        select: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
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

const getPaymentsByActionId = async (actionId) => {
  return await prisma.payment.findMany({
    where: { actionId: Number(actionId) },
    include: {
      doctor: {
        select: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      patient: true,
      status: true,
      action: true,
    },
  });
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByActionId,
};
