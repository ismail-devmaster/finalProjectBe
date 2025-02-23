const paymentService = require("../services/paymentService");

exports.createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    // Optionally, assign patientId or doctorId from req.user if needed
    const payment = await paymentService.createPayment(paymentData);
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body);
    res.json({ message: "Payment updated successfully", payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Failed to update payment" });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
};

exports.getPaymentsByActionId = async (req, res) => {
  try {
    const { actionId } = req.params;
    const payments = await paymentService.getPaymentsByActionId(actionId);
    res.json({ payments });
  } catch (error) {
    console.error("Error fetching payments by actionId:", error);
    res.status(500).json({ error: "Failed to fetch payments by actionId" });
  }
};

