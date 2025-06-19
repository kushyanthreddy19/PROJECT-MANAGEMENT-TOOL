const { Project, User } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const { name, description, dueDate, status } = req.body;
    const project = await Project.create({ name, description, dueDate, status });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ include: 'assignedUsers' });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, { include: 'assignedUsers' });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, dueDate, status } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.name = name;
    project.description = description;
    project.dueDate = dueDate;
    project.status = status;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignUsers = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const users = await User.findAll({ where: { id: req.body.userIds } });
    await project.setAssignedUsers(users);
    res.json({ message: 'Users assigned to project' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
