const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStaff = async () => {
  return await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "DOCTOR", "RECEPTIONIST"] } },
  });
};

const getReceptionist = async () => {
  return await prisma.user.findMany({
    where: { role: "RECEPTIONIST" },
  });
};

const getReceptionistsAndDoctor = async (doctorId) => {
  return await prisma.user.findMany({
    where: {
      OR: [
        { role: "RECEPTIONIST" },
        { AND: [
          { role: "DOCTOR" },
          { id: parseInt(doctorId) }
        ]}
      ]
    }
  });
};

const getReceptionistsAndDoctors = async () => {
  return await prisma.user.findMany({
    where: {
      role: { in: ["RECEPTIONIST", "DOCTOR"] }
    }
  });
};

const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  });
};

module.exports = { 
  getStaff, 
  getReceptionist, 
  getReceptionistsAndDoctor,
  getReceptionistsAndDoctors,
  getUserById
};
