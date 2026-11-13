const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes: verify JWT Bearer token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "teamup_jwt_secret_key_2026"
    );

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed or token has expired.",
    });
  }
};

// Grant access to specific roles (e.g. Admin, Project Leader)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : "Unknown"}' is not authorized to perform this action.`,
      });
    }
    next();
  };
};

