// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/', auth, role(['Admin', 'Manager']), projectController.createProject);
router.get('/', auth, projectController.getAllProjects);
router.get('/:id', auth, projectController.getProjectById);
router.put('/:id', auth, role(['Admin', 'Manager']), projectController.updateProject);
router.delete('/:id', auth, role(['Admin', 'Manager']), projectController.deleteProject);
router.post('/:id/assign', auth, role(['Admin', 'Manager']), projectController.assignUsers);

module.exports = router;