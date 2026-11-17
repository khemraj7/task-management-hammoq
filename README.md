# Task Manager

A simple task management app built with React, Express, and MongoDB using Mongoose.

## Features

- Create tasks with an optional description.
- Edit task details.
- Mark tasks complete or incomplete.
- Delete tasks.
- Save tasks in MongoDB through Mongoose.

## Project structure

```text
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   └── test/
├── frontend/
│   └── src/
│       ├── components/
│       ├── services/
│       └── test/
├── package.json
└── README.md
```

The backend separates HTTP routes, controllers, task rules, and database access. This keeps each part focused on one responsibility.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB Community Server or a MongoDB Atlas connection string

## Install and run

From the project root:

```sh
npm install
npm run dev
```

Make sure MongoDB is running locally, or set `MONGODB_URI` to your MongoDB connection string before starting the app. The default local connection is `mongodb://127.0.0.1:27017/task_manager`.

Open the frontend at [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:3000](http://localhost:3000).

## Test and build

```sh
npm test
npm run build
```

Backend API tests use Node's built-in test runner and an in-memory test repository, so they do not require a running MongoDB server. Frontend tests use Vitest and Testing Library.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update task details or completion |
| DELETE | `/api/tasks/:id` | Delete a task |

Task fields: `id`, `title`, `description`, `completed`, and `createdAt`.
