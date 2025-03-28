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

module.exports = { getStaff, getReceptionist };
