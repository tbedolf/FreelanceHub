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
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link to="/">FreelanceHub</Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/projects">Projects</Link>

        {/* 👇 SHOW ONLY FOR CLIENTS */}
        {user && user.role?.toUpperCase() === "CLIENT" && (
          <Link to="/new-project">Post Project</Link>
        )}

        {user ? (
          <>
            <span>
              Welcome, {user.name} ({user.role})
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}