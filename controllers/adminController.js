const adminService = require("../services/adminService");

exports.verifyAdmin = async (req, res) => {
  res.json({ isAdmin: true });
};

exports.updateRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const validRoles = ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"];
    if (!userId || !newRole) {
      return res
        .status(400)
        .json({ error: "User ID and new role are required." });
    }
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }
    const updatedUser = await adminService.updateRole(userId, newRole);
    res.json({
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Failed to update user role." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await adminService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await adminService.getAllPatients();
    res.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await adminService.getAllDoctors();
    res.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

exports.getAllReceptionists = async (req, res) => {
  try {
    const receptionists = await adminService.getAllReceptionists();
    res.json({ receptionists });
  } catch (error) {
    console.error("Error fetching receptionists:", error);
    res.status(500).json({ error: "Failed to fetch receptionists" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
