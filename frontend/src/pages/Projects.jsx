import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5001/api/projects");

      setProjects(res.data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: "30px" }}>Open Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="card">
            <h2>{project.title}</h2>

            <p style={{ marginBottom: "10px", color: "#374151" }}>
              {project.description}
            </p>

            <p>
              <strong>Budget:</strong> ${project.budgetMin} - $
              {project.budgetMax}
            </p>

            <p>
              <strong>Category:</strong> {project.category}
            </p>

            <p>
              <span className="badge">{project.status}</span>
            </p>

            <p style={{ marginBottom: "15px" }}>
              <strong>Client:</strong> {project.client?.name}
            </p>

            <Link to={`/projects/${project.id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}