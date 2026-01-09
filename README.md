# ✅ Task Tracker Application

A full-stack task management application built with the **MERN stack** (MongoDB, Express, React, Node.js) that allows users to sign up, log in, and manage their personal tasks.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based login & signup)
- 📝 **Create, Update, Delete Tasks**
- ✅ **Mark Tasks as Complete/Incomplete**
- 🔍 **Search and Filter** (All / Completed / Pending)
- 🧠 **Protected Dashboard** (Only accessible after login)
- 💅 **TailwindCSS UI** with responsive design

---

## 📁 Project Structure

task-tracker/
├── frontend/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── App.js
│ └── index.js
├── backend/ # Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── .env # Environment variables
│ └── server.js
└── README.md


---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Auth |
|----------|---------|----------|------|
| React (Hooks) | Node.js | MongoDB (Mongoose) | JWT |
| React Router | Express.js | MongoDB Atlas (or local) | |
| Tailwind CSS | CORS & dotenv |  | |

---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Ramansaha/task-tracker.git
cd task-tracker
```

---

## 🐳 Docker Setup (Recommended)

### 2a. Configure Environment Variables

Create a `.env` file in the project root with all required variables:

```env
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGO_DATABASE=tasktracker
MONGO_PORT=27018
MONGO_URI=mongodb://root:your_secure_password_here@mongo:27017/tasktracker?authSource=admin
PORT=8000
AUTHTOKEN_SECRETKEY=your_jwt_secret_key_here
```

### 2b. Start with Docker Compose

```bash
docker compose up -d
```

This will start:
- MongoDB on port `27018` (or the port you specified)
- Backend API on port `8000`

### 2c. Connect to MongoDB

Use MongoDB Compass with:
```
mongodb://root:your_secure_password_here@localhost:27018/admin?authSource=admin
```

---

## 💻 Local Development Setup

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/tasktracker
AUTHTOKEN_SECRETKEY=your_jwt_secret_key_here
```

### 3. Start the Backend Server

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:8000`

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔐 API Overview

### Authentication Routes

| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| POST   | `/api/taskTrac/auth/register` | Register new user + token  |
| POST   | `/api/taskTrac/auth/login`    | User login + token         |

### Task Routes (Protected by JWT)

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | `/api/taskTrac/task/get`        | Get all user tasks     |
| POST   | `/api/taskTrac/task/add`        | Create a new task      |
| PATCH  | `/api/taskTrac/task/update:id`  | Update a task (status) |
| DELETE | `/api/taskTrac/task/delete/:id` | Delete a task          |

> Add `Authorization: Bearer <your_jwt_token>` header to access protected routes.

---

## 💡 Additional Notes

- Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test backend APIs.
- Tasks are scoped per user; each user can only access their own tasks.
- The app uses localStorage to persist the JWT token on the frontend.

---
