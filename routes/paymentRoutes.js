const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// POST /payments - allowed only for DOCTOR
router.post(
  "/",
  authenticateUser,
  authorizeRoles("DOCTOR"),
  paymentController.createPayment
);

// GET /payments - allowed for PATIENT, DOCTOR, RECEPTIONIST, and ADMIN
router.get(
  "/",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"),
  paymentController.getAllPayments
);

// GET /payments/action/:actionId - allowed for RECEPTIONIST, PATIENT, and DOCTOR
router.get(
  "/action/:actionId",
  authenticateUser,
  authorizeRoles("RECEPTIONIST", "PATIENT", "DOCTOR"),
  paymentController.getPaymentsByActionId
);

// GET /payments/:id - allowed for PATIENT, DOCTOR, RECEPTIONIST, and ADMIN
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"),
  paymentController.getPaymentById
);

// PUT /payments/:id - allowed only for DOCTOR
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("DOCTOR"),
  paymentController.updatePayment
);

// DELETE /payments/:id - allowed only for DOCTOR
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("DOCTOR"),
  paymentController.deletePayment
);

module.exports = router;
