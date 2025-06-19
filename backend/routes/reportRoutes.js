const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware'); // assuming you have auth middleware

// All routes require authentication
router.use(authMiddleware);

router.get('/tasks', reportController.getTaskCountByStatus);
router.get('/overdue', reportController.getOverdueTasks);
router.get('/projects/:id/progress', reportController.getProjectProgress);

module.exports = router;
