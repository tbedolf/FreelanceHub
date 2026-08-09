import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useFeedback } from "../context/FeedbackContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { confirmAction, notify } = useFeedback();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");

  const role = user?.role?.toUpperCase();

  useEffect(() => {
    if (!user || role !== "CLIENT") return;

    setProjectsLoading(true);
    API.get("/projects", { params: { clientId: user.id } })
      .then(({ data }) => setProjects(data))
      .catch((error) => {
        setProjectsError(error.response?.data?.message || "Failed to load your projects.");
      })
      .finally(() => setProjectsLoading(false));
  }, [user, role]);

  async function handleDeleteProject(project) {
    const confirmed = await confirmAction({
      title: "Delete project?",
      message: `Delete “${project.title}”? This also removes its bids and milestones.`,
      confirmLabel: "Delete project",
    });
    if (!confirmed) return;

    try {
      await API.delete(`/projects/${project.id}`);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      notify("Project deleted.");
    } catch (error) {
      notify(error.response?.data?.message || "Failed to delete project.", "error");
    }
  }

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <p>Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

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
            <Link className="button-link" to="/projects">Browse Projects</Link>

            {role === "CLIENT" && (
              <Link className="button-link" to="/new-project">Post a Project</Link>
            )}
          </div>
        </div>

        {role === "CLIENT" && (
          <section className="card client-projects-section">
            <div className="section-heading-row">
              <div>
                <h2>My Projects</h2>
                <p>Open, edit, or remove projects you have posted.</p>
              </div>
              <Link to="/new-project" className="button-link">Post a Project</Link>
            </div>

            {projectsLoading && <p>Loading your projects…</p>}
            {projectsError && <p className="error-message">{projectsError}</p>}
            {!projectsLoading && !projectsError && projects.length === 0 && (
              <div className="empty-state">
                <p>You have not posted any projects yet.</p>
                <Link to="/new-project">Create your first project</Link>
              </div>
            )}

            <div className="owned-project-list">
              {projects.map((project) => (
                <article className="owned-project" key={project.id}>
                  <div className="owned-project-details">
                    <div className="card-heading-row">
                      <h3>{project.title}</h3>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <p>{project.description}</p>
                    <span>${project.budgetMin}–${project.budgetMax} · {project.category}</span>
                  </div>
                  <div className="project-actions">
                    <Link to={`/projects/${project.id}`} className="button-link secondary">View</Link>
                    {project.status === "OPEN" && (
                      <Link to={`/projects/${project.id}/edit`} className="button-link secondary">Edit</Link>
                    )}
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteProject(project)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
