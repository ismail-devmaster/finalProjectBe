// unitRoutes.js

const express = require("express");
const router = express.Router();
const { getInventoryUnits } = require("../controllers/unitController");

router.get("/", getInventoryUnits);

module.exports = router;
