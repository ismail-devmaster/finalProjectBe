const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");
const { authenticatePatient, authenticateDoctor } = require("../middlewares/authMiddleware");

// For POST /actions
router.post("/", 
  authenticatePatient, actionController.createAction,
  authenticateDoctor, actionController.createAction,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// For GET /actions
router.get("/",
  authenticatePatient, actionController.getAllActions,
  authenticateDoctor, actionController.getAllActions,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// For GET /actions/:id
router.get("/:id",
  authenticatePatient, actionController.getActionById,
  authenticateDoctor, actionController.getActionById,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// For PUT /actions/:id
router.put("/:id",
  authenticatePatient, actionController.updateAction,
  authenticateDoctor, actionController.updateAction,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

// For DELETE /actions/:id
router.delete("/:id",
  authenticatePatient, actionController.deleteAction,
  authenticateDoctor, actionController.deleteAction,
  (req, res) => res.status(403).json({ error: "Access restricted to patients or doctors" })
);

module.exports = router;
