const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// JWT Generation function
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Helper function to generate a random verification token
const generateVerificationToken = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// Authentication middleware: reads token from cookie
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, async () => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
};

// Google OAuth Setup with temporary token generation for new users
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { value: email } = profile.emails[0];
        const nameParts = profile.displayName.split(" ");
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          // Existing user, proceed with normal login.
          return done(null, user);
        }

        // If user does not exist, generate a temporary token with Google info.
        const tempTokenPayload = {
          email,
          firstName,
          lastName,
          googleId: profile.id,
        };

        const tempToken = jwt.sign(
          tempTokenPayload,
          process.env.JWT_TEMP_SECRET,
          { expiresIn: "10m" } // Short lifetime for security
        );

        // Instead of creating a user immediately, return an object with the temp token.
        return done(null, { tempToken, isNewUser: true });
      } catch (error) {
        console.error("Error during Google auth: ", error);
        done(error);
      }
    }
  )
);

// Routes
// Google Authentication Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  async (req, res) => {
    // If a new user, redirect to complete-profile page with the temp token
    if (req.user.isNewUser && req.user.tempToken) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/complete-profile?tempToken=${req.user.tempToken}`
      );
    }
    // For existing users, proceed with the normal login flow
    const user = req.user;
    try {
      const { accessToken, refreshToken } = generateTokens(user.id, user.role);
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.cookie("authToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 15 * 60 * 1000,
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
      console.error("Callback error: ", error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/login`);
    }
  }
);

// Endpoint to complete profile and create a new user
app.post("/update-profile", async (req, res) => {
  const { tempToken, phone, sexId, dateOfBirth } = req.body;
  if (!tempToken || !phone || !sexId || !dateOfBirth) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Verify the temporary token
    const tempPayload = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET);
    const { email, firstName, lastName } = tempPayload;

    // Double-check that the user doesn't already exist
    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Parse the provided dateOfBirth (expected in "YYYY-MM-DD" format)
    const [year, month, day] = dateOfBirth.split("-");
    const parsedDate = new Date(year, month - 1, day);

    // Create a random password (or implement a method to set a password later)
    const password = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user using both Google info and the additional details
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isVerified: true,
        role: "PATIENT",
        patient: {
          create: {
          },
        },
        dateOfBirth: parsedDate,
        phone,
        sexId: parseInt(sexId, 10),
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
    console.error("Update profile error: ", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Traditional Auth Routes (from klim.js)
app.post("/signup", async (req, res) => {
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

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !phone ||
    !sexId
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [year, month, day] = dateOfBirth.split("-");
    const parsedDate = new Date(year, month - 1, day);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const verificationToken = generateVerificationToken();
    const user = await prisma.user.create({
      data: {
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
      },
    });

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
      html: `<a href="${process.env.BACKEND_URL}/verify/${verificationToken}">Verify Email</a>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Failed to send verification email" });
      }
      res
        .status(201)
        .json({ message: "Registration successful. Verify your email." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: req.params.token },
    });
    if (!user) {
      return res.status(400).send("Invalid token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });
    res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during verification");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isVerified) {
      return res.status(401).json({ error: "Invalid login details" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid login details" });
    }

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
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, refreshToken },
    });

    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const { accessToken, newRefreshToken } = generateTokens(user.id, user.role);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Tokens refreshed" });
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Token refresh failed" });
  }
});

app.post("/logout", authenticateUser, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Logout failed" });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = generateVerificationToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email: user.email },
      data: { resetToken, resetTokenExpiry },
    });

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
      html: `<a href="${process.env.FRONTEND_URL}/reset/${resetToken}">Reset Password</a>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send email" });
      }
      res.json({ message: "Password reset email sent" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset failed" });
  }
});

app.get("/api/admin/verify", authenticateAdmin, (req, res) => {
  res.json({ isAdmin: true });
});
// Update user role endpoint (only accessible to admins)
app.put("/update-role", authenticateAdmin, async (req, res) => {
  const { userId, newRole } = req.body;
  if (!userId || !newRole) {
    return res.status(400).json({ error: "User ID and new role are required." });
  }
  
  // Validate the newRole against allowed roles
  const validRoles = ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ error: "Invalid role provided." });
  }
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    res.json({
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role." });
  }
});
// Delete user endpoint (only accessible to admin)
app.delete("/user/:id", authenticateAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    // Find the user by id
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user is a patient, delete the associated patient record first.
    if (user.role === "PATIENT") {
      await prisma.patient.delete({ where: { userId } });
    }
    // If the user is a doctor, delete the associated doctor record first.
    else if (user.role === "DOCTOR") {
      await prisma.doctor.delete({ where: { userId } });
    }
    // If the user is a receptionist (assuming "repository" refers to receptionist), delete the record first.
    else if (user.role === "RECEPTIONIST") {
      await prisma.receptionist.delete({ where: { userId } });
    }
    
    // Delete the user record
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
