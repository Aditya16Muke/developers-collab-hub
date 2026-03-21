const express = require('express');
const router = express.Router();
const {
  getProjects, getMyProjects, getProjectById,
  createProject, updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',        getProjects);
router.get('/mine',    protect, getMyProjects);  // must be before /:id
router.get('/:id',     getProjectById);
router.post('/',       protect, createProject);
router.put('/:id',     protect, updateProject);
router.delete('/:id',  protect, deleteProject);

module.exports = router;