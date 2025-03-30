const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Protect all inventory routes for admin access only
router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  inventoryController.createInventory
);
router.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  inventoryController.getAllInventories
);

router.get(
  "/low-stock",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  inventoryController.getLowInventories
);

router.get(
  "/in-stock",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCtOR"),
  inventoryController.getInStockInventories
);

router.get(
  "/out-of-stock",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  inventoryController.getOutOfStockInventories
);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  inventoryController.getInventoryById
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  inventoryController.updateInventory
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  inventoryController.deleteInventory
);

module.exports = router;
