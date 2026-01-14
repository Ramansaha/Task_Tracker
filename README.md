# ✅ Task Tracker Application

A full-stack task management application built with **React**, **Node.js**, **Express**, **MongoDB**, and **PostgreSQL**. This application features a dual-database architecture where MongoDB handles user authentication and PostgreSQL manages task data. The application is fully containerized with Docker and includes CI/CD pipelines.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based login & signup)
- 📝 **Create, Read, Update, Delete Tasks**
- ✏️ **Edit Tasks** (with immutable start date)
- ✅ **Mark Tasks as Complete/Incomplete**
- 🔍 **Search and Filter** (All / Completed / Pending)
- 📅 **Task Dates** (Start date and End date)
- 📄 **Task Descriptions** (expandable task details)
- 🧠 **Protected Dashboard** (Only accessible after login)
- 💅 **Modern UI** with TailwindCSS and responsive design
- 🎨 **Reusable Modal Components** for confirmations and task management
- 🐳 **Dockerized** for easy deployment
- 🔄 **CI/CD Pipeline** with GitHub Actions
- ✅ **Pre-commit Hooks** for code quality

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, React Router, Vite, TailwindCSS 4 |
| **Backend** | Node.js, Express.js |
| **Databases** | MongoDB 7 (Users), PostgreSQL 16 (Tasks) |
| **ORM/ODM** | Mongoose (MongoDB), Sequelize (PostgreSQL) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Code Quality** | ESLint, Husky, lint-staged |

---

## 📁 Project Structure

```
Task_Tracker/
├── backend/                    # Express.js backend
│   ├── config/
│   │   ├── conn.js            # MongoDB connection
│   │   └── postgresConn.js    # PostgreSQL connection
│   ├── controllers/
│   │   ├── auth/              # Authentication controllers
│   │   ├── task/              # Task controllers
│   │   └── user/              # User controllers
│   ├── models/
│   │   ├── task/
│   │   │   ├── task.js        # MongoDB task model (legacy)
│   │   │   └── taskPostgres.js # PostgreSQL task model
│   │   └── user/              # User model (MongoDB)
│   ├── routes/                # API routes
│   ├── helper/                # Helper functions
│   ├── dockerfile             # Backend Dockerfile
│   ├── server.js              # Express server entry point
│   └── package.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTaskModal.jsx      # Task create/edit modal
│   │   │   └── ConfirmationModal.jsx # Delete confirmation modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── Login.jsx      # Login page
│   │   │   └── Signup.jsx     # Signup page
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── .husky/                    # Git hooks
├── docker-compose.yml         # Docker services configuration
├── package.json               # Root package.json (Husky setup)
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** and **Docker Compose** (recommended) OR
- **Node.js** (v20 or higher) and **npm**
- **MongoDB** (if running locally without Docker)
- **PostgreSQL** (if running locally without Docker)
- **Git**

> **Note**: The recommended setup uses Docker, which eliminates the need to install MongoDB and PostgreSQL locally.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ramansaha/Task_Tracker.git
cd Task_Tracker
```

---

## 🐳 Docker Setup (Recommended)

This is the easiest way to run the application. Docker will handle all database setup automatically.

### Step 1: Configure Environment Variables

Create a `.env` file in the **project root** (same directory as `docker-compose.yml`) with the following variables:

```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGO_DATABASE=tasktracker
MONGO_PORT=27018

# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=tasktracker
POSTGRES_PORT=5433

# Backend Configuration
PORT=8000
AUTHTOKEN_SECRETKEY=your_jwt_secret_key_here_min_32_chars
```

> **Important**: 
> - Replace `your_secure_password_here` with a strong password
> - Replace `your_jwt_secret_key_here_min_32_chars` with a secure random string (at least 32 characters)
> - The `.env` file should be in the **project root** (same directory as `docker-compose.yml`)
> - The backend server will also check for `.env` in the `backend/` directory as a fallback

### Step 2: Start Docker Services

```bash
docker compose up -d
```

This command will:
- Start MongoDB on port `27018` (mapped from container port 27017)
- Start PostgreSQL on port `5433` (mapped from container port 5432)
- Build and start the backend API on port `8000`

### Step 3: Verify Services

Check if all containers are running:

```bash
docker compose ps
```

You should see three services running:
- `task_tracker_mongo`
- `task_tracker_postgres`
- `task_tracker_backend`

### Step 4: View Logs (Optional)

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f mongo
docker compose logs -f postgres
```

### Step 5: Start Frontend

Open a new terminal and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 💻 Local Development Setup (Without Docker)

If you prefer to run the application without Docker:

### Step 1: Install MongoDB and PostgreSQL

Install MongoDB and PostgreSQL on your local machine.

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory (or project root - the server checks both locations):

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/tasktracker
MONGO_DATABASE=tasktracker

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=tasktracker

# Backend Configuration
PORT=8000
AUTHTOKEN_SECRETKEY=your_jwt_secret_key_here_min_32_chars
```

### Step 3: Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:8000`

### Step 4: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔌 Connecting to Databases

### MongoDB Compass

To connect MongoDB Compass to the Dockerized MongoDB:

```
mongodb://root:your_secure_password_here@localhost:27018/admin?authSource=admin
```

Replace `your_secure_password_here` with the password you set in `.env`.

### PostgreSQL Client

To connect to the Dockerized PostgreSQL:

- **Host**: `localhost`
- **Port**: `5433`
- **Database**: `tasktracker`
- **Username**: `postgres` (or your `POSTGRES_USER`)
- **Password**: Your `POSTGRES_PASSWORD`

---

## 🔐 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/taskTrac/auth/register` | Register a new user | No |
| POST | `/api/taskTrac/auth/login` | Login user and get JWT token | No |

### Task Routes (Protected - Requires JWT)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/taskTrac/task/list` | Get all tasks for the authenticated user | Yes |
| GET | `/api/taskTrac/task/list/:id` | Get a specific task by ID | Yes |
| POST | `/api/taskTrac/task/add` | Create a new task | Yes |
| PUT | `/api/taskTrac/task/upadte/:id` | Update a task (title, description, endDate, completed) | Yes |
| DELETE | `/api/taskTrac/task/delete/:id` | Delete a task | Yes |

> **Note**: 
> - All task routes require `Authorization: Bearer <your_jwt_token>` header
> - The `startDate` field cannot be updated after task creation (immutable)
> - Task updates can modify: `title`, `description`, `endDate`, and `completed` status

### Request/Response Examples

#### Create Task
```json
POST /api/taskTrac/task/add
Headers: { "Authorization": "Bearer <token>", "Content-Type": "application/json" }
Body: {
  "title": "Complete project",
  "description": "Finish the task tracker application",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20"
}
```

#### Update Task
```json
PUT /api/taskTrac/task/upadte/:id
Headers: { "Authorization": "Bearer <token>", "Content-Type": "application/json" }
Body: {
  "title": "Updated title",
  "description": "Updated description",
  "endDate": "2024-01-25",
  "completed": false
}
```

---

## 🗄️ Database Architecture

### MongoDB (Users)
- **Purpose**: User authentication and user data
- **Collections**: `users`
- **Schema**: Email, password (hashed), and user metadata

### PostgreSQL (Tasks)
- **Purpose**: Task management data
- **Tables**: `tasks`
- **Schema**: 
  - `id` (UUID, Primary Key)
  - `title` (String, Required)
  - `description` (Text, Optional)
  - `startDate` (Date, Required, Immutable)
  - `endDate` (Date, Required)
  - `completed` (Boolean, Default: false)
  - `userId` (String, Foreign Key to MongoDB user)
  - `createdAt`, `updatedAt` (Timestamps)

---

## 🧪 Development

### Running Linters

```bash
# Frontend linting
cd frontend
npm run lint

# Backend linting
cd backend
npm run lint

# Fix linting issues
npm run lint:fix
```

### Pre-commit Hooks

The project uses Husky and lint-staged to run ESLint before commits. This ensures code quality and consistency.

---

## 🚢 CI/CD Pipeline

The project includes GitHub Actions workflows for:

- **CI Pipeline** (`.github/workflows/ci.yml`):
  - Runs on PRs and pushes to `dev`, `staging`, `main`
  - Lints frontend and backend code
  - Builds the frontend

- **CD Pipelines**:
  - `cd-dev.yml`: Deployment to development
  - `cd-staging.yml`: Deployment to staging
  - `cd-main.yml`: Deployment to production

### Branch Protection

Recommended branch protection rules:
- `dev`, `staging`, `main`: Require CI checks to pass
- Allow solo developers to merge without additional approvals

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# View logs
docker compose logs -f

# Restart a specific service
docker compose restart backend

# Rebuild and start
docker compose up -d --build
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Issues

1. **Check MongoDB container is running**:
   ```bash
   docker compose ps
   ```

2. **Verify MongoDB logs**:
   ```bash
   docker compose logs mongo
   ```

3. **Check authentication**:
   Ensure `MONGO_ROOT_PASSWORD` in `.env` matches the password used in connection strings.

### PostgreSQL Connection Issues

1. **Check PostgreSQL container is running**:
   ```bash
   docker compose ps
   ```

2. **Verify PostgreSQL health**:
   ```bash
   docker compose logs postgres
   ```

3. **Check port conflicts**:
   Ensure port `5433` (or your `POSTGRES_PORT`) is not in use by another service.

### Backend Not Starting

1. **Check environment variables**:
   Ensure all required variables are set in `backend/.env`

2. **View backend logs**:
   ```bash
   docker compose logs backend
   ```

3. **Rebuild the backend**:
   ```bash
   docker compose up -d --build backend
   ```

---

## 📝 Additional Notes

- Tasks are scoped per user; each user can only access their own tasks
- The app uses `localStorage` to persist the JWT token on the frontend
- Start date is immutable after task creation (cannot be edited)
- Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test backend APIs
- The application supports both Docker and local development setups

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Raman Kumar**

- GitHub: [@Ramansaha](https://github.com/Ramansaha)
- Repository: [Task_Tracker](https://github.com/Ramansaha/Task_Tracker)

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Docker for containerization
- GitHub Actions for CI/CD
- Open source community for excellent tools and libraries

---

**Happy Task Tracking! 🎉**
