const userService = require('../services/userService');

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

module.exports = { 
  getUsersController, 
  getReceptionistsController,
  getReceptionistsAndDoctorController 
};
