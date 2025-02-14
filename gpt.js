const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const session = require("express-session");
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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

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

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true },
    });
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Admin middleware
const authenticateAdmin = async (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
};

// Helper function to generate verification tokens
const generateVerificationToken = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            password: await bcrypt.hash(Math.random().toString(), 10),
            firstName: profile.displayName.split(" ")[0],
            lastName: profile.displayName.split(" ").slice(1).join(" "),
            dateOfBirth: new Date(),
            phone: "",
            sexId: 1,
            isVerified: true,
            role: "PATIENT",
          },
        });
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Serialize and deserialize user for Passport sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
// Sign-Up Route
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

  // Validate required fields
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
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    // Convert dateOfBirth to a valid Date object
    const [year, month, day] = dateOfBirth.split("-");
    const parsedDateOfBirth = new Date(year, month - 1, day); // Note: Months are 0-indexed in JavaScript

    // Validate the converted date
    if (isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({ error: "Invalid dateOfBirth format" });
    }

    // Create the user with the default role (PATIENT)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth: parsedDateOfBirth,
        phone,
        sexId: parseInt(sexId, 10), // Ensure sexId is an integer
        isVerified: false,
        verificationToken,
        role: "PATIENT", // Default role is PATIENT
        patient: { create: { ...roleData } },
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
      html: `Click here to verify your email.`,
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

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Email not verified. Please verify your email first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Save refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookies
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
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
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Token Refresh Route
app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user with the matching refresh token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, refreshToken },
    });

    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      user.role
    );

    // Update the refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    // Set new cookies
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

// Logout Route
app.post("/logout", authenticateUser, async (req, res) => {
  try {
    // Clear the refresh token from the database
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    // Clear cookies
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ADMIN VERIFICATION ENDPOINT
app.get("/api/admin/verify", authenticateAdmin, (req, res) => {
  res.json({ isAdmin: true });
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
      html: `Click here to reset your password.`,
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

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
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
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect("/profile");
  }
);

app.get("/profile", authenticateUser, async (req, res) => {)


// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
