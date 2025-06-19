# Project Management Tool

This is a full-stack project management tool with a React frontend and a Node.js/Express backend using Sequelize ORM.

## Backend

- Located in the `backend/` directory.
- Built with Node.js, Express, and Sequelize.
- Uses SQLite as the database (file: `backend/database.sqlite`).
- Contains models for projects, tasks, users, comments, user stories, and project assignments.
- Provides RESTful API endpoints for authentication, projects, tasks, comments, user stories, reports, and AI features.
- Middleware for authentication and role-based access control.
- Migrations and scripts for database setup and maintenance.

### Running Backend

1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`
3. Run migrations and seeders if needed.
4. Start the server: `npm start` or `node server.js`
5. The API runs on `http://localhost:5000/api` by default.

## Frontend

- Located in the `frontend/` directory.
- Built with React, React Router, and Tailwind CSS.
- Uses Axios for API requests with token-based authentication.
- Contains pages for login, registration, dashboard, project management, task management, user story generation, and admin user management.
- Components include Navbar, ProjectList, ProjectForm, TaskList, UserStoryForm, Dashboard, and more.
- Uses React Context for authentication state management.
- Responsive and modern UI with react-icons for enhanced visuals.

### Running Frontend

1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev` or `npm start`
4. The frontend runs on `http://localhost:3000` by default.

## Environment Variables

- Frontend expects `REACT_APP_API_URL` to point to the backend API URL.
- Backend uses environment variables for database configuration and JWT secrets.

## Notes

- Ensure backend server is running before starting the frontend.
- Authentication tokens are stored in localStorage and sent with API requests.
- Role-based access control is implemented for admin features.
- The project uses Tailwind CSS for styling and react-icons for icons.

## Scripts

- Backend scripts for database reset, cleaning duplicate IDs, and fixing schema issues are in `backend/scripts/`.
- Migrations are in `backend/migrations/`.

## License

This project is licensed under the MIT License.
