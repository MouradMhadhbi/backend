const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const listUser = await User.find().populate("role");
    res.status(200).json({ message: "List Users", listUser });
  } catch (error) {
    res.status(500).json({ message: "error server", error });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const userToFind = await User.findById(req.params.id).populate("role");
    if (!userToFind) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User is", userToFind });
  } catch (error) {
    res.status(500).json({ message: "error server", error });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToEdit = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate(role);
    if (!userToEdit) res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User edited successfully!", user:userToEdit });
  } catch (error) {
    res.status(500).json({ message: "error server", error });
  }
};
exports.deleteUser = async (req, res) => {
  try {
      const delUser = await User.findByIdAndDelete(req.params.id);
      console.log(delUser)
    if (!delUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully!", delUser });
  } catch (error) {
      console.log(error.message)
    res.status(500).json({ message: "error server", error });
  }
};
