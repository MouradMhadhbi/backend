const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    titre: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    permissions: [{
        type: String
    }],
  },
  { timestamps: true, versionKey: false }
);
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;