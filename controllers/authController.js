const authService = require("../services/authService");
const mailService = require("../services/mailService");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      sexId,
      roleData,
    } = req.body;
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
    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
  // If a new user, redirect to complete-profile page with the temporary token
  if (req.user.isNewUser && req.user.tempToken) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/complete-profile?tempToken=${req.user.tempToken}`
    );
  }
  // For existing users, generate tokens and update their refresh token in the database
  try {
    const { generateTokens } = require("../utils/tokenUtil");
    const prisma = require("../config/database");
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const roleRedirects = {
      ADMIN: "/admin",
      DOCTOR: "/staff/doctor",
      RECEPTIONIST: "/staff/receptionist",
      PATIENT: "/patient",
    };
    const redirectPath = roleRedirects[user.role] || "/auth/login";
    return res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
  } catch (error) {
    console.error("Google callback error: ", error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/login`);
  }
};

exports.completeProfile = async (req, res) => {
  const { tempToken, phone, sexId, dateOfBirth } = req.body;
  if (!tempToken || !phone || !sexId || !dateOfBirth) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcryptjs");
    const { generateTokens } = require("../utils/tokenUtil");
    const prisma = require("../config/database");

    // Verify the temporary token provided by Google OAuth callback
    const tempPayload = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET);
    const { email, firstName, lastName } = tempPayload;

    // Ensure a user with the same email doesn't already exist
    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Parse the dateOfBirth (assumed format: YYYY-MM-DD)
    const [year, month, day] = dateOfBirth.split("-");
    const parsedDate = new Date(year, month - 1, day);

    // Create a random password (to be reset or changed later)
    const password = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user using both the Google info and additional fields
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isVerified: true,
        role: "PATIENT",
        dateOfBirth: parsedDate,
        phone,
        sexId: parseInt(sexId, 10),
        patient: {
          create: {},
        },
      },
    });

    // Generate tokens and update the user record with the refresh token
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

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
      message: "Profile updated and user created successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Complete profile error: ", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
