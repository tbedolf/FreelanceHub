# 🤝 FreelanceHub

A full-stack freelance marketplace built as a senior capstone project to connect **clients** and **freelancers** through project posting, bidding, milestone tracking, and reviews.

The application was developed collaboratively using an Agile workflow with Git/GitHub, pull requests, testing, and continuous integration.

---

## ✨ Features

- 🔐 User registration and login
- 👥 Role-based access for Clients, Freelancers, and Admins
- 📋 Project creation and project browsing
- 💰 Freelancer bidding system
- ✅ Bid acceptance and rejection
- 🎯 Milestone tracking
- ⭐ Reviews and feedback
- 🛡️ Protected routes and JWT-based authentication
- 🗄️ PostgreSQL database integration
- 🚀 CI workflow with GitHub Actions

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Prisma ORM
- JWT
- bcryptjs

### Database

- PostgreSQL
- AWS RDS

### DevOps & Collaboration

- Git
- GitHub
- GitHub Actions
- Docker
- Agile development
- Pull requests
- Code reviews

---

## 🏗️ Architecture

```text
┌───────────────────────────────┐
│           User                │
│       Web Browser             │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│        React Frontend         │
│      Vite / React Router      │
└──────────────┬────────────────┘
               │
             REST API
               │
               ▼
┌───────────────────────────────┐
│     Node.js / Express API     │
│ JWT Auth • Role Protection    │
└──────────────┬────────────────┘
               │
            Prisma ORM
               │
               ▼
┌───────────────────────────────┐
│          PostgreSQL           │
│          AWS RDS              │
└───────────────────────────────┘
```

---

## 👥 User Roles

### Client

Clients can:

- Create projects
- Define budgets and project details
- Review freelancer bids
- Manage project milestones
- Leave reviews

### Freelancer

Freelancers can:

- Browse available projects
- Submit bids
- Track accepted work
- Participate in milestone workflows

### Admin

Administrators support platform oversight and role-based access.

---

## 📦 Core Data Model

The application uses Prisma with PostgreSQL.

Core models include:

- `User`
- `Project`
- `Bid`
- `Milestone`
- `Review`

### Project Status

- `OPEN`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### Bid Status

- `PENDING`
- `ACCEPTED`
- `REJECTED`

### Milestone Status

- `TODO`
- `IN_PROGRESS`
- `SUBMITTED`
- `APPROVED`

---

## 🔐 Authentication & Authorization

FreelanceHub uses JWT-based authentication.

Authenticated API requests use a Bearer token:

```text
Authorization: Bearer <token>
```

Protected backend routes validate the user's identity and role before allowing access to restricted functionality.

Passwords are hashed using `bcryptjs`.

---

## 🔌 API Overview

Representative API routes include:

```text
POST /api/auth/register
POST /api/auth/login

GET  /api/projects
GET  /api/projects/:id
POST /api/projects

POST /api/projects/:id/bids
POST /api/projects/:id/milestones
POST /api/projects/:id/reviews
```

---

## 📁 Project Structure

```text
FreelanceHub/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── prisma/
│   └── server files
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── Vite configuration
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md
```

---

## 🖥️ Frontend Pages

The application includes pages for:

- Login
- Registration
- Dashboard
- Projects
- Project Details
- New Project
- Task Board
- Workspaces

Protected routes are used to restrict authenticated areas of the application.

---

## ☁️ Cloud Database

The project was configured to use **Amazon RDS for PostgreSQL**.

Prisma manages the database schema and application data access.

This provided practical experience with:

- Cloud database connectivity
- Environment variables
- Database migrations
- Security group configuration
- Troubleshooting database connection issues

---

## ⚙️ Continuous Integration

GitHub Actions is used for CI checks.

The workflow supports automated validation of project changes and reinforces collaborative development practices.

---

## 🎯 What This Project Demonstrates

FreelanceHub demonstrates hands-on experience with:

- Full-stack application development
- REST API design
- Authentication and authorization
- Role-based access control
- Relational database design
- PostgreSQL and Prisma ORM
- AWS RDS
- React frontend development
- Express.js backend development
- Git/GitHub collaboration
- CI/CD concepts
- Agile team development
- Debugging and integration troubleshooting

---

## 🚀 Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create the required environment variables before starting the application.

Example backend variables:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
CLIENT_URL=http://localhost:5173
```

> Never commit real credentials or production connection strings.

---

## 🔮 Future Improvements

Potential future enhancements include:

- Real-time messaging
- File uploads
- Notifications
- Expanded administrative controls
- Improved testing coverage
- Production deployment improvements

---

## 👤 Author

**Bedolf Tambe**

Cloud • DevOps • Networking • Systems Administration • Software Engineering
