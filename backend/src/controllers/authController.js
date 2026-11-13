const User = require("../models/User");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    let { name, email, password, role, university, skills, bio } = req.body;

    if (typeof skills === "string") {
      skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Generate avatar initials
    const words = name.trim().split(" ");
    const initials =
      words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

    const user = await User.create({
      name,
      email,
      password,
      role: role || "Team Member",
      university: university || "University",
      skills: Array.isArray(skills) ? skills : [],
      bio: bio || "Passionate builder on TeamUp.",
      avatarInitials: initials,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        skills: user.skills,
        rating: user.rating,
        avatarInitials: user.avatarInitials,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        skills: user.skills,
        rating: user.rating,
        avatarInitials: user.avatarInitials,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile & skills
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, university, skills, githubUrl, portfolioUrl, isAvailable } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (university) fieldsToUpdate.university = university;
    if (skills) fieldsToUpdate.skills = skills;
    if (githubUrl !== undefined) fieldsToUpdate.githubUrl = githubUrl;
    if (portfolioUrl !== undefined) fieldsToUpdate.portfolioUrl = portfolioUrl;
    if (isAvailable !== undefined) fieldsToUpdate.isAvailable = isAvailable;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users with search and filter
// @route   GET /api/auth/users
// @access  Public
exports.getAllUsers = async (req, res) => {
  try {
    const { skill, university, search } = req.query;
    let query = {};

    if (skill) {
      query.skills = { $in: [new RegExp(skill, "i")] };
    }
    if (university) {
      query.university = new RegExp(university, "i");
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { bio: new RegExp(search, "i") },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const users = await User.find(query).sort({ rating: -1, reviewCount: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

