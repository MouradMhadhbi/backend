const hashRole = (...allowedRole) => {
  return (req, res, next) => {
    //check if req.user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        errors: [{ message: "User not authenticated" }],
      });
    }
    //check if req.user.role is in allowedRole
    if (!allowedRole.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        errors: [{ message: "Access denied: insufficient permissions" }],
      });
    }
    next();
  };
};
module.exports = hashRole;
