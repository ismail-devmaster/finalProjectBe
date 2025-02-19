const prisma = require("../config/database");

const getAllDoctors = async () => {
  return await prisma.doctor.findMany({
    include: {
      appointments: true,
      payments: true,
    },
  });
};

const getDoctorById = async (id) => {
  return await prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      appointments: true,
      payments: true,
    },
  });
};

module.exports = { getAllDoctors, getDoctorById };
