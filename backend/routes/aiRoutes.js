// routes/aiRoutes.js
const express = require('express');
const { generateUserStoriesForProject } = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth);  // Protected endpoint
router.post('/generate-user-stories', generateUserStoriesForProject);

module.exports = router;
