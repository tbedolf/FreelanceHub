import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFeedback } from "../context/FeedbackContext";
import PageHeader from "../components/PageHeader";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { confirmAction, notify } = useFeedback();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const [userResponse, projectResponse] = await Promise.all([
        API.get("/admin/users"), API.get("/projects"),
      ]);
      setUsers(userResponse.data);
      setProjects(projectResponse.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function toggle(target) {
    if (target.isActive) {
      const confirmed = await confirmAction({
        title: "Disable account?",
        message: `${target.name} will immediately lose access to protected features.`,
        confirmLabel: "Disable account",
      });
      if (!confirmed) return;
    }
    try {
      await API.patch(`/admin/users/${target.id}/status`, { isActive: !target.isActive });
      notify(target.isActive ? "Account disabled." : "Account reactivated.");
      load();
    } catch (requestError) {
      notify(requestError.response?.data?.message || "Failed to update account.", "error");
    }
  }

  if (user?.role !== "ADMIN") return <main className="page"><div className="error-message">Administrator access required.</div></main>;
  return <main className="page page-wide">
    <PageHeader
      eyebrow="Platform controls"
      title="Administration"
      description="Manage account access and review activity across FreelanceHub."
    />
    {error && <div className="error-message" role="alert">{error}</div>}
    {loading && <div className="loading-state">Loading administration data…</div>}
    <div className="admin-grid">
      <section className="card admin-section">
        <div className="section-heading-row">
          <div><h2>Registered users</h2><p>{users.length} accounts on the platform</p></div>
        </div>
        {!loading && !error && users.length === 0 && <div className="empty-state"><p>No users found.</p></div>}
        <div className="admin-list">
          {users.map((item) => <article className="admin-row" key={item.id}>
            <div className="admin-identity">
              <span>{item.name?.charAt(0).toUpperCase()}</span>
              <div><strong>{item.name}</strong><small>{item.email}</small></div>
            </div>
            <span className="role-chip">{item.role}</span>
            <span className={`status-badge ${item.isActive ? "status-active" : "status-disabled"}`}>
              {item.isActive ? "Active" : "Disabled"}
            </span>
            {item.id !== user.id && <button className={item.isActive ? "danger-button compact-button" : "compact-button"} onClick={() => toggle(item)}>
              {item.isActive ? "Disable" : "Reactivate"}
            </button>}
          </article>)}
        </div>
      </section>

      <section className="card admin-section">
        <div className="section-heading-row">
          <div><h2>Platform projects</h2><p>{projects.length} projects currently listed</p></div>
        </div>
        {!loading && !error && projects.length === 0 && <div className="empty-state"><p>No projects found.</p></div>}
        <div className="admin-list">
          {projects.map((project) => <Link className="admin-project-row" to={`/projects/${project.id}`} key={project.id}>
            <div><strong>{project.title}</strong><small>{project.client?.name || "Unknown client"}</small></div>
            <span className={`status-badge status-${project.status.toLowerCase()}`}>
              {project.status.replace("_", " ")}
            </span>
          </Link>)}
        </div>
      </section>
    </div>
  </main>;
}
