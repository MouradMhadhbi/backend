const Role = require("../../models/Role");
const seedRoles = async () => {
  try {
    const count = await Role.countDocuments();
    if (count > 0) {
      console.log("✅ Roles already seeded");
      return;
    }
    //initial roles
    await Role.insertMany([
      { titre: "ADMIN", permissions: [] },
      { titre: "USER", permissions: [] },
      { titre: "MODERATOR", permissions: [] },
    ]);
    console.log("✅ Roles seeded successfully");
  } catch (error) {
    console.log("❌ Error seeding roles:", error.message);
  }
};
module.exports = seedRoles;
