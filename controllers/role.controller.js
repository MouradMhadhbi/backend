const Role = require("../models/Role")


exports.getAllRole = async (req, res) => {
    try {
        const listRole = await Role.find()
        res.status(200).json({message:"List of roles", listRole})
    } catch (error) {
        res.status(500).json({message:"Error server!!"})
    }
}