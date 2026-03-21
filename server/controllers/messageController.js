const Message = require('../models/Message');
const Project = require('../models/Project');

// @route   GET /api/messages/:projectId
const getMessages = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only owner or collaborators can read messages
    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.collaborators.some(c => c.toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this project' });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(100); // Last 100 messages

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages };