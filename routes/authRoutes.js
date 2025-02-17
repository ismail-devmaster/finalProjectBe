const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const { authenticateUser } = require("../middlewares/authMiddleware");

// Google OAuth routes
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  authController.googleCallback
);

// Traditional authentication routes
router.post("/signup", authController.signup);
router.get("/verify/:token", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authenticateUser, authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Complete profile for new Google users (if needed)
router.post("/update-profile", authController.completeProfile);

module.exports = router;
