import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo-wrapper">
        <div className="logo-icon">FH</div>
        <span className="logo-text">FreelanceHub</span>
      </Link>

      <div className="nav-links">
        <Link to="/projects">Projects</Link>

        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user?.role === "FREELANCER" && <Link to="/my-bids">My Bids</Link>}
        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}

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
