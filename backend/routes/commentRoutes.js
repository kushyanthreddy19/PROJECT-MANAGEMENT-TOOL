// routes/commentRoutes.js
const express = require('express');
const { create, getByTask, remove } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, create);
router.get('/task/:taskId', auth, getByTask);
router.delete('/:id', auth, remove);

module.exports = router;
