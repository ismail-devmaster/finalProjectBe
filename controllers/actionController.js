const actionService = require("../services/actionService");

exports.createAction = async (req, res) => {
  try {
    let actionData = req.body;
    // If a patient is logged in, ensure patientId is set from req.user.
    if (req.role === "PATIENT") {
      actionData.patientId = req.id;
    }
    const action = await actionService.createAction(actionData);
    res.status(201).json({ message: "Action created successfully", action });
  } catch (error) {
    console.error("Error creating action:", error);
    res.status(500).json({ error: "Failed to create action" });
  }
};

exports.getAllActions = async (req, res) => {
  try {
    const actions = await actionService.getAllActions();
    res.json({ actions });
  } catch (error) {
    console.error("Error fetching actions:", error);
    res.status(500).json({ error: "Failed to fetch actions" });
  }
};

exports.getActionById = async (req, res) => {
  try {
    const action = await actionService.getActionById(req.params.id);
    if (!action) return res.status(404).json({ error: "Action not found" });
    res.json({ action });
  } catch (error) {
    console.error("Error fetching action:", error);
    res.status(500).json({ error: "Failed to fetch action" });
  }
};

exports.getActionsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const actions = await actionService.getActionsByPatientId(patientId);
    res.json({ actions });
  } catch (error) {
    console.error("Error fetching actions by patient id:", error);
    res.status(500).json({ error: "Failed to fetch actions by patient id" });
  }
};

exports.updateAction = async (req, res) => {
  try {
    const action = await actionService.updateAction(req.params.id, req.body);
    res.json({ message: "Action updated successfully", action });
  } catch (error) {
    console.error("Error updating action:", error);
    res.status(500).json({ error: "Failed to update action" });
  }
};

exports.deleteAction = async (req, res) => {
  try {
    await actionService.deleteAction(req.params.id);
    res.json({ message: "Action deleted successfully" });
  } catch (error) {
    console.error("Error deleting action:", error);
    res.status(500).json({ error: "Failed to delete action" });
  }
};
