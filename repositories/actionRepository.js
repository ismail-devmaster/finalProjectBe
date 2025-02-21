const prisma = require("../config/database");

const createAction = async (data) => {
  return await prisma.action.create({ data });
};

const getAllActions = async () => {
  return await prisma.action.findMany({
    include: {
      patient: true,
      appointments: true,
      payments: true,
      appointmentType: true,
    },
  });
};

const getActionById = async (id) => {
  return await prisma.action.findUnique({
    where: { id: Number(id) },
    include: {
      patient: true,
      appointments: true,
      payments: true,
      appointmentType: true,
    },
  });
};

const updateAction = async (id, updateData) => {
  return await prisma.action.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteAction = async (id) => {
  return await prisma.action.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction,
};
