import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import ProjectDetails from "./pages/ProjectDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function Home() {
  return (
    <main className="page">
      <section className="hero">
        <h1>Find talent. Win projects. Track milestones.</h1>

        <p>
          FreelanceHub is a full-stack marketplace for clients and freelancers
          to manage projects, bids, milestones, and reviews.
        </p>

        <Link to="/projects">
          <button>Browse Projects</button>
        </Link>
      </section>
    </main>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      {/* ✅ Logo Section */}
      <Link to="/" className="logo-wrapper">
        <div className="logo-icon">FH</div>
        <span className="logo-text">FreelanceHub</span>
      </Link>

      {/* ✅ Nav Links */}
      <div className="nav-links">
        <Link to="/projects">Projects</Link>

        {user && <Link to="/dashboard">Dashboard</Link>}

        {user && user.role?.toUpperCase() === "CLIENT" && (
          <Link to="/new-project">Post Project</Link>
        )}

        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}

        {user && (
          <>
            <span className="user-pill">
              {user.name} · {user.role}
            </span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-project"
          element={
            <ProtectedRoute>
              <NewProject />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}