import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    title: "", category: "", budgetMin: "", budgetMax: "", status: "",
  });

  async function fetchProjects(e) {
    e?.preventDefault();
    try {
      setLoading(true);
      setError("");

      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );
      const res = await API.get("/projects", { params });

      setProjects(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="page page-wide">
      <PageHeader
        eyebrow="Marketplace"
        title="Open projects"
        description="Find work that matches your skills, budget, and availability."
      />

      <form onSubmit={fetchProjects} className="card filter-card">
        <div className="section-heading-row">
          <div>
            <h2>Find the right opportunity</h2>
            <p>Search by keyword, category, budget, or project status.</p>
          </div>
        </div>
        <div className="filter-grid">
          <label htmlFor="filter-title">Keywords</label>
          <input id="filter-title" placeholder="e.g. website" value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
          <label htmlFor="filter-category">Category</label>
          <input id="filter-category" placeholder="e.g. Web" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
          <label htmlFor="filter-min">Minimum budget</label>
          <input id="filter-min" min="0" type="number" value={filters.budgetMin} onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })} />
          <label htmlFor="filter-max">Maximum budget</label>
          <input id="filter-max" min="0" type="number" value={filters.budgetMax} onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })} />
          <label htmlFor="filter-status">Project status</label>
          <select id="filter-status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option><option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <button disabled={loading}>{loading ? "Searching…" : "Apply filters"}</button>
      </form>

      {error && <div className="error-message" role="alert">{error}</div>}
      {loading ? (
        <div className="loading-state">Loading projects…</div>
      ) : !error && projects.length === 0 ? (
        <div className="empty-state"><p>No projects match your filters.</p></div>
      ) : (
        <div className="project-list-grid">
          {projects.map((project) => (
            <article key={project.id} className="card marketplace-card">
              <div className="card-heading-row">
                <span className="project-category">{project.category}</span>
                <span className={`status-badge status-${project.status.toLowerCase()}`}>
                  {project.status.replace("_", " ")}
                </span>
              </div>
              <h2>{project.title}</h2>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <div>
                  <small>Budget</small>
                  <strong>${project.budgetMin}–${project.budgetMax}</strong>
                </div>
                <div>
                  <small>Client</small>
                  <strong>{project.client?.name || "FreelanceHub client"}</strong>
                </div>
              </div>
              <Link className="button-link" to={`/projects/${project.id}`}>
                View project <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
