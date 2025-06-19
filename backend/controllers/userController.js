// controllers/userController.js
const { User } = require('../models');

// @route GET /api/users
// @desc Get all users
// @access Admin
// Sample response: [{ "id": 1, "name": "Alice", "email": "a@b.com", "role": "Manager" }, ...]
exports.getAll = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
  res.json(users);
};

// @route GET /api/users/:id
// @desc Get user by ID
// @access Admin
// Sample response: { "id": 1, "name": "Alice", "email": "a@b.com", "role": "Manager" }
exports.getById = async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'role'] });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @route PUT /api/users/:id
// @desc Update user by ID
// @access Admin
// Sample payload: { "name": "Alice Smith", "role": "Developer" }
// Sample response: { "message": "User updated" }
exports.update = async (req, res) => {
  const { name, role } = req.body;
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update({ name, role });
  res.json({ message: 'User updated' });
};

// @route DELETE /api/users/:id
// @desc Delete user by ID
// @access Admin
// Sample response: { "message": "User deleted" }
exports.remove = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.destroy();
  res.json({ message: 'User deleted' });
};
