import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import PageHeader from "../components/PageHeader";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get("/bids/mine").then(({ data }) => setBids(data))
      .catch((e) => setError(e.response?.data?.message || "Failed to load bids"))
      .finally(() => setLoading(false));
  }, []);

  return <main className="page page-wide">
    <PageHeader
      eyebrow="Freelancer workspace"
      title="My submitted bids"
      description="Track every proposal and open its project for the latest details."
      action={<Link className="button-link" to="/projects">Find projects</Link>}
    />
    {loading && <div className="loading-state">Loading your bids…</div>}
    {error && <div className="error-message" role="alert">{error}</div>}
    {!loading && !error && bids.length === 0 && <div className="empty-state"><p>You have not submitted any bids.</p></div>}
    <div className="bid-list project-list-grid">
      {bids.map((bid) => (
        <Link
          className="card bid-card-link"
          key={bid.id}
          to={`/projects/${bid.project.id}`}
          aria-label={`View ${bid.project.title}`}
        >
          <div className="card-heading-row">
            <h2>{bid.project.title}</h2>
            <span className={`status-badge status-${bid.status.toLowerCase()}`}>
              {bid.status}
            </span>
          </div>
          <p className="project-description">{bid.proposal}</p>
          <div className="project-meta">
            <div><small>Your bid</small><strong>${bid.bidAmount}</strong></div>
            <div><small>Delivery</small><strong>{bid.estimatedDays} days</strong></div>
          </div>
          <span className="text-link">View Project →</span>
        </Link>
      ))}
    </div>
  </main>;
}
