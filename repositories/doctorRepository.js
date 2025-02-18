const prisma = require("../config/database");

const getAllDoctors = async () => {
  return await prisma.doctor.findMany({
    include: {
      specialty: true, // Include related specialty if needed
      appointments: true,
      payments: true,
    },
  });
};

const getDoctorById = async (id) => {
  return await prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      specialty: true,
      appointments: true,
      payments: true,
    },
  });
};

module.exports = { getAllDoctors, getDoctorById };
