const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Protect all task endpoints with authentication
router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
