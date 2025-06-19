// controllers/taskController.js
const { Task, User, Comment, Project } = require('../models');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, deadline, projectId, assignedTo } = req.body;
    const task = await Task.create({ title, description, status, deadline, projectId, assignedTo });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const whereClause = {};
    const statusMap = {
      'to do': 'planned',
      'todo': 'planned',
      'in-progress': 'in-progress',
      'done': 'done'
    };
    if (req.query.status && req.query.status !== 'all') {
      const mappedStatus = statusMap[req.query.status.toLowerCase()] || req.query.status;
      whereClause.status = mappedStatus;
    }
    const tasks = await Task.findAll({ 
      where: whereClause,
      include: ['assignedUser', 'comments', { model: Project }] 
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: ['assignedUser', 'comments'] });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, deadline, assignedTo } = req.body;
    task.title = title;
    task.description = description;
    task.status = status;
    task.deadline = deadline;
    task.assignedTo = assignedTo;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Renamed to match route: POST /api/tasks/:id/comments
exports.addCommentToTask = async (req, res) => {
  try {
    const { text } = req.body; // ✅ changed from 'content' to 'text'
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = await Comment.create({ text, taskId, userId }); // ✅ use 'text' here too
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

