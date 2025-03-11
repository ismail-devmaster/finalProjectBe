const express = require("express");
const router = express.Router();
const { getTaskPriorities } = require("../controllers/taskPriorityController");

router.get("/", getTaskPriorities);

module.exports = router;
