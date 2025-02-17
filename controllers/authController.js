const authService = require("../services/authService");
const mailService = require("../services/mailService");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, phone, sexId, roleData } = req.body;
    const { user, verificationToken } = await authService.signup({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      sexId,
      roleData,
    });
    await mailService.sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      message: "Registration successful. Verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    await authService.verifyEmail(token);
    res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login({ email, password });
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const tokens = await authService.refreshTokenService(refreshToken);
    res.cookie("authToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Tokens refreshed" });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const prisma = require("../config/database");
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { resetToken } = await authService.forgotPassword(email);
    await mailService.sendResetPasswordEmail(email, resetToken);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const token = req.params.token;
    await authService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Optionally, add handlers for Google OAuth callback or complete profile
exports.googleCallback = async (req, res) => {
  // Logic can be integrated with your Passport callback
};

exports.completeProfile = async (req, res) => {
  // Implement similar to your /update-profile endpoint
};
