const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Prisma client and Express app
const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  })
);

// Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Helper function to generate a random verification token
const generateVerificationToken = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// Sign-Up Route
app.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, roleData } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    // Ensure dateOfBirth is a valid Date object (if provided)
    if (roleData?.dateOfBirth) {
      // Convert "YYYY-MM-DD" string to a Date object
      const [year, month, day] = roleData.dateOfBirth.split("-");
      const dateOfBirth = new Date(year, month - 1, day); // Note: Months are 0-indexed in JavaScript

      // Validate the converted date
      if (isNaN(dateOfBirth.getTime())) {
        return res.status(400).json({ error: "Invalid dateOfBirth format" });
      }

      // Update roleData with the validated Date object
      roleData.dateOfBirth = dateOfBirth;
    }

    // Create the user with the default role (PATIENT)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verificationToken,
        patient: roleData ? { create: { ...roleData } } : undefined, // Only create patient data if roleData is provided
      },
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="http://localhost:4000/verify/${verificationToken}">here</a> to verify your email.</p>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Failed to send verification email" });
      }
      res.status(201).json({
        message:
          "User registered successfully. Please check your email for verification.",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Email Verification Route
app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find the user with the given verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired verification token");
    }

    // Mark the user as verified and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    console.error("Error during verification:", error.message);
    res.status(500).send("Internal server error");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email first.",
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return success response
    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a password reset token
    const resetToken = generateVerificationToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save the reset token and its expiry time in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // Send password reset email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="http://localhost:3000/auth/reset-password/${resetToken}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Failed to send password reset email" });
      }
      res
        .status(200)
        .json({ message: "Password reset email sent successfully." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset Password Route
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    // Find the user with the given reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // Ensure the token hasn't expired
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
