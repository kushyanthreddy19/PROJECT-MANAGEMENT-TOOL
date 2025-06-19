const { Task } = require('../models');
const { Op } = require('sequelize');

// 1. Task count by status
exports.getTaskCountByStatus = async (req, res) => {
  try {
    const statuses = ['toDo', 'inProgress', 'done'];
    const counts = {};

    for (const status of statuses) {
      counts[status] = await Task.count({ where: { status } });
    }

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Overdue tasks list
exports.getOverdueTasks = async (req, res) => {
  try {
    const today = new Date();

    const overdueTasks = await Task.findAll({
      where: {
        deadline: { [Op.lt]: today },
        status: { [Op.not]: 'done' }
      }
    });

    res.json(overdueTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Project completion percentage
exports.getProjectProgress = async (req, res) => {
  try {
    const projectId = req.params.id;

    const totalTasks = await Task.count({ where: { projectId } });
    if (totalTasks === 0) {
      return res.json({ projectId, completionPercentage: 0 });
    }

    const doneTasks = await Task.count({ where: { projectId, status: 'done' } });

    const completionPercentage = (doneTasks / totalTasks) * 100;

    res.json({ projectId, completionPercentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
