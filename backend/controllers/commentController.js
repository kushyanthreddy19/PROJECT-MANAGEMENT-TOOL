// controllers/commentController.js
const { Comment } = require('../models');

// @route POST /api/comments
// @desc Add a comment to a task
// @access Authenticated (all roles)
// Sample payload: { "text": "Looks good", "taskId": 1 }
// Sample response: { "id": 1, "text": "Looks good", "taskId": 1, "userId": 3 }
exports.create = async (req, res) => {
  const { text, taskId } = req.body;
  const comment = await Comment.create({ text, taskId, userId: req.user.id });
  res.status(201).json(comment);
};

// @route GET /api/comments/task/:taskId
// @desc Get all comments for a task
// @access Authenticated
// Sample response: [{ "id": 1, "text": "Comment", "taskId": 1, "userId": 3 }, ...]
exports.getByTask = async (req, res) => {
  const comments = await Comment.findAll({ where: { taskId: req.params.taskId } });
  res.json(comments);
};

// @route DELETE /api/comments/:id
// @desc Delete a comment by ID
// @access Admin or comment owner
// Sample response: { "message": "Comment deleted" }
exports.remove = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (req.user.role !== 'Admin' && comment.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await comment.destroy();
  res.json({ message: 'Comment deleted' });
};
