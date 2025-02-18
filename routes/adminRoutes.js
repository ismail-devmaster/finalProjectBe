const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

router.get("/verify", authenticateAdmin, adminController.verifyAdmin);
router.put("/update-role", adminController.updateRole);
router.delete("/user/:id", authenticateAdmin, adminController.deleteUser);
router.get("/patients", authenticateAdmin, adminController.getAllPatients);
router.get("/doctors", authenticateAdmin, adminController.getAllDoctors);
router.get(
  "/receptionists",
  authenticateAdmin,
  adminController.getAllReceptionists
);
router.get("/users", authenticateAdmin, adminController.getAllUsers);

module.exports = router;
