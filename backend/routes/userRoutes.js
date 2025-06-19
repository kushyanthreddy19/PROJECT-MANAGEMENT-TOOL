// routes/userRoutes.js
const express = require('express');
const { getAll, getById, update, remove } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/', auth, role(['Admin']), getAll);
router.get('/:id', auth, role(['Admin']), getById);
router.put('/:id', auth, role(['Admin']), update);
router.delete('/:id', auth, role(['Admin']), remove);

module.exports = router;
