const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Protect all task endpoints with authentication
router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.createTask
);
router.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.getAllTasks
);
router.get(
  "/my-completed-tasks",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.getMyCompletedTasks
);
router.get(
  "/my-tasks",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.getMyTasks
);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.getTaskById
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.updateTask
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  taskController.deleteTask
);

module.exports = router;
