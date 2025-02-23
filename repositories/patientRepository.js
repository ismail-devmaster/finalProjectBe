const prisma = require("../config/database");

const getAllPatients = async () => {
  return await prisma.patient.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          phone: true,
        
        email: true,
      sex: {
        select: {
                gender: {select: { gender: true }},
              },
      }},
      },
    },
  });
};
const getPatientById = async (id) => {
  try {
    const parsedId = Number(id); // Only do this if id is supposed to be a number
    const patient = await prisma.patient.findUnique({
      where: { userId: parsedId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            phone: true,
            email: true,
            sex: {
              select: {
                gender: {select: { gender: true }},
              },
            }
          },
        },
      },
    });
    console.log("Fetched patient:", patient);
    return patient;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

const getPatientId = async (userId) => {
  return await prisma.patient.findUnique({
    where: { userId: Number(userId) },
    select: { userId: true }, // only return the id
  });
};

module.exports = { getAllPatients, getPatientById, getPatientId };
