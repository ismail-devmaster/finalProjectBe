const express = require("express");
const router = express.Router();
const { getTaskStatuses } = require("../controllers/taskStatusController");

// Only authenticated users can fetch task statuses
router.get("/", getTaskStatuses);

module.exports = router;
