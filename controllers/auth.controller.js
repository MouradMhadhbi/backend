//chaque route d'authentification est gérée ici
//chauque route ==> controller

const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const removeUploadImg = require("../util/removeUploadImg");

//-------------------------REGISTER------------------------
exports.register = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;
    //image apres
    // let profilePic = null;
    let profilePic = "https://avatar.iran.liara.run/public";
    profilePic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    // console.log(profilePic);
    //vérifier si l'email existe déjà
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      removeUploadImg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Email already exists" }],
      });
    }
    // console.log("Role titre received:", roleTitre);
    if (!roleTitre || typeof roleTitre !== "string") {
      
      removeUploadImg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Role is required" }],
      });
    }
    const normRoleTitre = roleTitre.trim().toUpperCase();
    const existedRole = await Role.findOne({ titre: normRoleTitre });
    if (!existedRole) {
      removeUploadImg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Role not found" }],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // if (req.file) {
    //   profilePic = `${req.protocol}://${req.get("host")}/uploads/${
    //     req.file.filename
    //   }`;
    // }
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
      profilePic,
      role: existedRole._id,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // console.log("❌ Error while creating user:", error.message);
    removeUploadImg(req.file);
    return res.status(500).json({
      success: false,
      errors: [{ message: "Server error while created user!" }],
    });
  }
};
//-------------------------LOGIN------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email }).populate("role");
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Invalid email or password" }],
      });
    }
    // console.log("Existing user found:", existingUser);
    //vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Invalid email or password" }],
      });
    }
    //token
    const token = JWT.sign(
      {
        userId: existingUser._id,
        role: existingUser.role.titre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "None", // Prevent CSRF attacks
      maxAge: 2*60*60*1000 // 2 hours
    });
    // console.log("User logged in successfully:", existingUser);
    //envoyer la réponse
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: existingUser,
      // token: token,
    });
  } catch (error) {
    // console.log("❌ Error while logging in user:", error.message);
    return res.status(500).json({
      success: false,
      errors: [{ message: "Server error while logging in user!" }],
    });
  }
};
// ---------------------------LOGOUT------------------------
exports.logout = (req, res) => {
  try {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
  });
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
} catch (error) {
  // console.log("❌ Error while logging out user:", error.message);
  return res.status(500).json({
    success: false,
    errors: [{ message: "Server error while logging out user!" }],
  });
}
}
// -------------------------CURRENT USER------------------------
exports.currentUser = async (req, res) => {
  try {
    const foundUser = await User.findById( req.user.id).populate("role");
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: [{ message: "User not found" }],
      });
    }
    return res.status(200).json({
      success: true,
      user: foundUser,
    });
  } catch (error) {
    // console.log("❌ Error while fetching current user:", error.message);
    return res.status(500).json({
      success: false,
      errors: [{ message: "Server error while fetching current user!" }],
    });
  }
};
