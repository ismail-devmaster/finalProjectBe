const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  categoryController.createCategory
);
router.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  categoryController.getAllCategories
);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  categoryController.getCategoryById
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  categoryController.deleteCategory
);

module.exports = router;
