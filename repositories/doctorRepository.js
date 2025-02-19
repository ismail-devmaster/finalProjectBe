const prisma = require("../config/database");

const getAllDoctors = async () => {
  return await prisma.doctor.findMany({
    include: {
      appointments: true,
      payments: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

const getDoctorById = async (id) => {
  return await prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      appointments: true,
      payments: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

module.exports = { getAllDoctors, getDoctorById };
