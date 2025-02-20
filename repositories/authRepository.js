const prisma = require("../config/database");

const findUserByEmail = async (email) =>
  await prisma.user.findUnique({ where: { email } });


const createUser = async (userData) =>
  await prisma.user.create({ data: userData });

const updateUserTokens = async (userId, refreshToken) =>
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });

const updateUserProfile = async (email, updateData) =>
  await prisma.user.update({ where: { email }, data: updateData });

const updateUserVerification = async (userId) =>
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true, verificationToken: null },
  });

const updateUserPassword = async (email, hashedPassword) =>
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
  });

const findUserByVerificationToken = async (token) =>
  await prisma.user.findUnique({ where: { verificationToken: token } });

const findUserByResetToken = async (token) =>
  await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

const updateResetToken = async (email, resetToken, resetTokenExpiry) =>
  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  });

module.exports = {
  findUserByEmail,
  createUser,
  updateUserTokens,
  updateUserProfile,
  updateUserVerification,
  updateUserPassword,
  findUserByVerificationToken,
  findUserByResetToken,
  updateResetToken,
};
