const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const {
  generateTokens,
  generateVerificationToken,
} = require("../utils/tokenUtil");
const authRepository = require("../repositories/authRepository");

const signup = async ({
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  phone,
  sexId,
  roleData,
}) => {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const [year, month, day] = dateOfBirth.split("-");
  const parsedDate = new Date(year, month - 1, day);
  if (isNaN(parsedDate.getTime())) throw new Error("Invalid date format");

  const verificationToken = generateVerificationToken();

  const user = await authRepository.createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    dateOfBirth: parsedDate,
    phone,
    sexId: parseInt(sexId, 10),
    isVerified: false,
    verificationToken,
    role: "PATIENT",
    patient: { create: { ...roleData } },
  });
  return { user, verificationToken };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user || !user.isVerified) throw new Error("Invalid login details");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid login details");

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  await authRepository.updateUserTokens(user.id, refreshToken);
  return { user, accessToken, refreshToken };
};

const refreshTokenService = async (oldRefreshToken) => {
  try {
    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // Depending on your implementation, retrieve the user and verify tokens.
    const user = await authRepository.findUserByEmail(decoded.email);
    if (!user || user.refreshToken !== oldRefreshToken)
      throw new Error("Invalid refresh token");

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await authRepository.updateUserTokens(user.id, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};

const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) throw new Error("User not found");
  const resetToken = generateVerificationToken();
  const resetTokenExpiry = new Date(Date.now() + 3600000);
  await authRepository.updateResetToken(email, resetToken, resetTokenExpiry);
  return { resetToken };
};

const verifyEmail = async (token) => {
  const user = await authRepository.findUserByVerificationToken(token);
  if (!user) throw new Error("Invalid token");
  await authRepository.updateUserVerification(user.id);
  return user;
};

const resetPassword = async (token, newPassword) => {
  const user = await authRepository.findUserByResetToken(token);
  if (!user) throw new Error("Invalid token");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authRepository.updateUserPassword(user.email, hashedPassword);
  return user;
};

const getUserId = async (userId) => {
  return await authRepository.getUserById(userId);
};

module.exports = {
  signup,
  login,
  refreshTokenService,
  forgotPassword,
  verifyEmail,
  resetPassword,
  getUserId,
};
