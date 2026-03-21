const User = require('../models/User');

// @desc    Get a user's public profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills, avatar, github } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name   = name   || user.name;
    user.bio    = bio    !== undefined ? bio    : user.bio;
    user.skills = skills !== undefined ? skills : user.skills;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.github = github !== undefined ? github : user.github;

    const updated = await user.save();

    res.json({
      _id:    updated._id,
      name:   updated.name,
      email:  updated.email,
      bio:    updated.bio,
      skills: updated.skills,
      avatar: updated.avatar,
      github: updated.github,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateProfile };