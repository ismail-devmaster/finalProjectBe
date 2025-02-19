const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const {
  authenticatePatient,
  authenticateDoctor,
  authenticateReceptionist,
  authenticateAdmin,
} = require("../middlewares/authMiddleware");

// POST /payments
router.post("/", authenticateDoctor, paymentController.createPayment);

// GET /payments
router.get("/", paymentController.getAllPayments);
router.get("/", authenticatePatient, paymentController.getAllPayments);
router.get("/", authenticateDoctor, paymentController.getAllPayments);
router.get("/", authenticateReceptionist, paymentController.getAllPayments);
router.get("/", authenticateAdmin, paymentController.getAllPayments);

// GET /payments/:id
router.get("/:id", authenticatePatient, paymentController.getPaymentById);
router.get("/:id", authenticateDoctor, paymentController.getPaymentById);
router.get("/:id", authenticateReceptionist, paymentController.getPaymentById);
router.get("/:id", authenticateAdmin, paymentController.getPaymentById);

// PUT /payments/:id
router.put("/:id", authenticateDoctor, paymentController.updatePayment);

// DELETE /payments/:id
router.delete("/:id", authenticateDoctor, paymentController.deletePayment);

module.exports = router;
