const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ✅ Import DB
const db = require('./models');

const { User } = db;

// ✅ Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userStoryRoutes = require('./routes/userStoryRoutes');
const aiRoutes = require('./routes/aiRoutes');

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user-stories', userStoryRoutes);
app.use('/api/ai', aiRoutes);

// 🧪 Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

(async () => {
  try {
    await db.sequelize.sync({ force: false, alter: true });
    console.log('✅ Database synced with force:false and alter:true');

    // Check if Admin user exists, create if not
    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Admin',
      });
      console.log('✅ Admin user created (email: admin@example.com, password: admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // 🟢 Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error syncing database:', err);
  }
})();
