const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      // console.error("❌ JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        errors: [{ message: "Server configuration error" }],
      });
    }
    const token = req.cookies.token;
    // console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        errors: [{ message: "No token provided, authorization denied" }],
      });
    }

const decoded =jwt.verify(token, process.env.JWT_SECRET)

    const foundUser = await User.findById(decoded.userId).populate("role");
    if (!foundUser) {
      return res.status(401).json({
        success: false,
        errors: [{ message: "User associated with token not found" }],
      });
    }

    req.user = {
      id: foundUser._id,
      role: foundUser.role.titre,
    };
    next();
  } catch (error) {
    // console.error("❌ Error in isAuth middleware:", error.message);
    return res.status(500).json({
        success: false,
        errors: [{ message: "Server error in authentication" }],
    });
  } 
};

module.exports = isAuth;
