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
  authorizeRoles("ADMIN"),
  categoryController.getAllCategories
);

module.exports = router;
