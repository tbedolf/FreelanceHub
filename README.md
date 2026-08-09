# Team 11

## Project Name

FreelanceHub — Freelancer Project Bidding Platform

## Project Description

FreelanceHub is a full-stack freelance marketplace platform where clients can post projects and freelancers can submit bids on available work. Clients can review bids, choose freelancers, manage milestones, and leave reviews after project completion.

The goal of this project is to create a platform that simplifies interactions between clients and freelancers while providing a structured workflow for project management.

Main features include:

- User authentication and role-based authorization
- Project posting and management
- Freelancer bidding system
- Bid acceptance workflow
- Milestone tracking
- Review and rating system
- Protected routes and user dashboards


## Students

### COMP 495 Student
- Bedolf Tambe - Team Manager

### COMP 394 Students
- Ben Christy
- Levi Diaz

### COMP 294 Students
- Rich Davenport


# Tech Stack

### Frontend
- React
- Vite
- React Router

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### ORM
- Prisma v5.22.0

### Authentication
- JWT (JSON Web Tokens)

### Development Environment
- Docker Compose PostgreSQL


# Prerequisites

Before running the project, install the following:

- Node.js v22
- npm
- Docker Desktop
- Git
- VS Code (recommended)

Install Prisma:

```bash
npm install prisma@5.22.0 @prisma/client@5.22.0
```


# Project Setup and Installation

After cloning the repository locally, follow the setup instructions below.

## Step 1: Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Verify Docker container is running:

```bash
docker ps
```

# Backend Setup

Open terminal #1:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```


# Prisma Setup

Initialize Prisma:

```bash
npx prisma init
```

Generate database tables:

```bash
npx prisma migrate dev --name init
```

Generate Prisma client:

```bash
npx prisma generate
```

# Start Backend

Run backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5001
```

# Frontend Setup

Open terminal #2:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

# Project Structure

```text
freelancehub/
│
├── backend/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── bid.controller.js
│   │   │   ├── milestone.controller.js
│   │   │   ├── project.controller.js
│   │   │   └── review.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── bid.routes.js
│   │   │   ├── milestone.routes.js
│   │   │   ├── project.routes.js
│   │   │   └── review.routes.js
│   │   │
│   │   ├── utils/
│   │   │   └── prisma.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── NewProject.jsx
│   │   │   └── ProjectDetails.jsx
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── index.html
│
├── docker-compose.yml
│
└── README.md
```

---