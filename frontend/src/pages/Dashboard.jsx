import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <p>Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const role = user.role?.toUpperCase();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-title">Dashboard</div>

        <Link to="/dashboard">Overview</Link>
        <Link to="/projects">Browse Projects</Link>

        {role === "CLIENT" && <Link to="/new-project">Post Project</Link>}

        <Link to="/">Back Home</Link>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Manage your freelance marketplace activity.</p>
          </div>

          <span className="user-pill">{user.role}</span>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h2>Role</h2>
            <p>
              You are currently logged in as a <strong>{user.role}</strong>.
            </p>
          </div>

          <div className="card">
            <h2>Projects</h2>
            {role === "CLIENT" ? (
              <p>You can post projects, review bids, accept freelancers, and create milestones.</p>
            ) : (
              <p>You can browse open projects and submit proposals.</p>
            )}
          </div>

          <div className="card">
            <h2>Workflow</h2>
            <p>
              FreelanceHub supports bids, milestones, approvals, completion,
              and reviews.
            </p>
          </div>
        </div>

        <div className="card">
          <h2>Quick Actions</h2>

          <div className="quick-actions">
            <Link to="/projects">
              <button>Browse Projects</button>
            </Link>

            {role === "CLIENT" && (
              <Link to="/new-project">
                <button>Post a Project</button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}