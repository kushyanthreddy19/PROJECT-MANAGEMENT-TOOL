// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/', auth, role(['Admin', 'Manager']), taskController.createTask);
router.get('/', auth, taskController.getAllTasks);
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id', auth, taskController.updateTask); // Role/permission checked inside controller
router.delete('/:id', auth, role(['Admin', 'Manager']), taskController.deleteTask);

// ✅ COMMENT route
router.post('/:id/comments', auth, taskController.addCommentToTask);

module.exports = router;
