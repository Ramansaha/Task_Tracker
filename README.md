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
git clone https://github.com/your-username/task-tracker.git
cd task-tracker

## 🧪 2. Configure Environment Variables

Create a `.env` file inside the `/backend` directory and add the following:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ Replace `your_mongodb_connection_string` and `your_jwt_secret` with your actual values.

---

## ▶️ 3. Start the Backend Server

```bash
cd backend
npm install
npm start
```

- The backend will run on `http://localhost:8000`.
- Make sure MongoDB is running locally or you have connected to MongoDB Atlas.

---

## 🌐 4. Setup Frontend (React)

```bash
cd ../frontend
npm install
```

---

## ▶️ 5. Start the Frontend Server

```bash
npm start
```

- The frontend will run on `http://localhost:3000`.

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
