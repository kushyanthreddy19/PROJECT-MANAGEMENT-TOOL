import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import ProjectList from './components/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import TaskList from './components/TaskList';
import TaskDetail from './pages/TaskDetail';
import UserStoryForm from './components/UserStoryForm';
import ProjectForm from './components/ProjectForm';
import ProjectSelect from './pages/ProjectSelect';
import ProjectEdit from './pages/ProjectEdit';
import TaskEdit from './pages/TaskEdit';
import AdminUserRegistration from './pages/AdminUserRegistration';
import Registration from './pages/Registration';
import AdminUserList from './pages/AdminUserList';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/projects" element={
              <PrivateRoute>
                <ProjectList />
              </PrivateRoute>
            } />
            <Route path="/projects/new" element={
              <PrivateRoute>
                <ProjectForm />
              </PrivateRoute>
            } />
            <Route path="/projects/:id" element={
              <PrivateRoute>
                <ProjectDetail />
              </PrivateRoute>
            } />
            <Route path="/projects/:id/edit" element={
              <PrivateRoute>
                <ProjectEdit />
              </PrivateRoute>
            } />
            <Route path="/tasks" element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            } />
            <Route path="/tasks/:id" element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            } />
            <Route path="/tasks/:id/edit" element={
              <PrivateRoute>
                <TaskEdit />
              </PrivateRoute>
            } />
            <Route path="/generate-user-story" element={
              <PrivateRoute>
                <ProjectSelect />
              </PrivateRoute>
            } />
            <Route path="/generate-user-story/:projectId" element={
              <PrivateRoute>
                <UserStoryForm />
              </PrivateRoute>
            } />
            <Route path="/admin/register" element={
              <PrivateRoute adminOnly={true}>
                <AdminUserRegistration />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute adminOnly={true}>
                <AdminUserList />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
