// server.js

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

dotenv.config();

// Initialize Express app
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Passport configuration and initialization
require("./config/passport");
app.use(passport.initialize());

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const actionRoutes = require("./routes/actionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const appointmentTypeRoutes = require("./routes/appointmentTypeRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Mount routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/actions", actionRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/appointmentType", appointmentTypeRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/payments", paymentRoutes);

// Middleware to log requests and responses
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()
      }] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});
// Start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running at:`);
  console.log(`➡️ Local: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  const prisma = require("./config/database");
  await prisma.$disconnect();
  process.exit(0);
});
