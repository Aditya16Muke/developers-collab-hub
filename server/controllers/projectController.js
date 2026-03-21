const Project = require('../models/Project');

// @route   GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { search, tech, status } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (tech)   query.techStack = { $in: [tech] };
    if (status) query.status = status;

    const projects = await Project.find(query)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/projects/mine
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id },
      ],
    })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name avatar email github')
      .populate('collaborators', 'name avatar');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, maxTeamSize, githubLink, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const project = await Project.create({
      title,
      description,
      techStack:   techStack   || [],
      maxTeamSize: maxTeamSize || 5,
      githubLink:  githubLink  || '',
      tags:        tags        || [],
      owner:       req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can update this' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can delete this' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects, getMyProjects, getProjectById,
  createProject, updateProject, deleteProject,
};