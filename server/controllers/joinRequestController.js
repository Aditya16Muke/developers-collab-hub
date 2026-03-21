const JoinRequest = require('../models/JoinRequest');
const Project = require('../models/Project');

// @route   POST /api/join-requests
const sendJoinRequest = async (req, res, next) => {
  try {
    const { projectId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Owner can't request to join their own project
    if (project.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are the owner of this project' });
    }

    // Already a collaborator
    if (project.collaborators.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a collaborator' });
    }

    // Already sent a request
    const existing = await JoinRequest.findOne({
      project:   projectId,
      applicant: req.user._id,
      status:    'pending',
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request' });
    }

    const request = await JoinRequest.create({
      project:   projectId,
      applicant: req.user._id,
      message:   message || '',
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/join-requests/:projectId
const getProjectRequests = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can view requests' });
    }

    const requests = await JoinRequest.find({ project: req.params.projectId })
      .populate('applicant', 'name avatar skills bio');

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/join-requests/:id
const respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const project = await Project.findById(request.project);
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    // If accepted, add user to collaborators
    if (status === 'accepted') {
      await Project.findByIdAndUpdate(request.project, {
        $addToSet: { collaborators: request.applicant },
      });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendJoinRequest, getProjectRequests, respondToRequest };