# FreelanceHub — Freelancer Project Bidding Platform

A full-stack freelance marketplace where clients post projects, freelancers submit bids, clients choose winners, projects move through milestones, and users leave reviews.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Dev DB: Docker Compose PostgreSQL

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
│   │   │   ├── NewProject.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── index.html
│
├── docker-compose.yml

## Quick Start

### 1. Start PostgreSQL
```bash
docker compose up -d
```

### 2. Backend setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

Backend runs on:
```text
http://localhost:5001
```

### 3. Frontend setup
Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```text
http://localhost:5173
```

## Demo Users
Create users through the Register page:
- Role: CLIENT
- Role: FREELANCER
- Role: ADMIN

## Core MVP Features Included
- Register/login
- JWT authentication
- Role-based users
- Client project creation
- Project browsing
- Freelancer bid submission
- Client bid acceptance
- Milestone creation and status updates
- Review/rating submission
