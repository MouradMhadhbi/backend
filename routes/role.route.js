const express = require("express");
const { getAllRole } = require("../controllers/role.controller");

const router = express.Router();

router.get("allRoles", getAllRole);


module.exports = router;
