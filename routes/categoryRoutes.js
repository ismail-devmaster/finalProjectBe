const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  categoryController.getAllCategories
);

module.exports = router;
