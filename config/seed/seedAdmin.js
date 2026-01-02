const User = require("../../models/User");
const Role = require("../../models/Role");
const bcrypt = require("bcrypt");
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }
    const adminRole = await Role.findOne({ titre: "ADMIN" });
    if (!adminRole) {
      console.log("❌ ADMIN role not found. Please seed roles first.");
      return;
    }
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const newAdmin = new User({
      userName: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      phone: process.env.ADMIN_PHONE,
      role: adminRole._id,
    });
    await newAdmin.save();
    console.log("✅ Admin user seeded successfully");
  } catch (error) {
    console.log("❌ Error seeding admin user:", error.message);
  }
};
module.exports = seedAdmin;