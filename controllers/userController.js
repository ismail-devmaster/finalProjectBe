const userService = require("../services/userService");

const getUsersController = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReceptionistsController = async (req, res) => {
  try {
    const receptionists = await userService.getReceptionists();
    res.status(200).json(receptionists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReceptionistsAndDoctorController = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const users = await userService.getReceptionistsAndDoctor(doctorId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReceptionistsAndDoctorsController = async (req, res) => {
  try {
    const users = await userService.getReceptionistsAndDoctors();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDataController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsersController,
  getReceptionistsController,
  getReceptionistsAndDoctorController,
  getReceptionistsAndDoctorsController,
  getUserDataController,
};
