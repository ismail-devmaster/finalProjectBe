const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const actionRoutes = require("./routes/actionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const appointmentTypeRoutes = require("./routes/appointmentTypeRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

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
  })
);

// Middleware to log requests and responses
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});
// Passport configuration and initialization
require("./config/passport");
app.use(passport.initialize());

// Mount routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/actions", actionRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/appointmentType", appointmentTypeRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/payments", paymentRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at:`);
  console.log(`➡️ Local:   http://localhost:${PORT}`);
});
// Graceful shutdown
process.on("SIGINT", async () => {
  const prisma = require("./config/database");
  await prisma.$disconnect();
  process.exit(0);
});
