import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFeedback } from "../context/FeedbackContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { confirmAction, notify } = useFeedback();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  const [bidForm, setBidForm] = useState({
    proposal: "",
    bidAmount: "",
    estimatedDays: "",
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [review, setReview] = useState({
    rating: "",
    comment: "",
  });

  async function fetchProject() {
    try {
      setLoading(true);
      setError("");
      const [projectResponse, reviewResponse] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/reviews/project/${id}`),
      ]);
      setProject(projectResponse.data);
      setReviews(reviewResponse.data);
    } catch (error) {
      console.error("PROJECT DETAILS ERROR:", error);
      if (error.response?.status === 401) {
        setError("Please log in to view this project.");
      } else if (error.response?.status === 404) {
        setError("Project not found.");
      } else {
        setError(error.response?.data?.message || "Failed to load project.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  function handleChange(e) {
    setBidForm({ ...bidForm, [e.target.name]: e.target.value });
  }

  function handleMilestoneChange(e) {
    setMilestoneForm({ ...milestoneForm, [e.target.name]: e.target.value });
  }

  async function handleBidSubmit(e) {
    e.preventDefault();

    try {
      await API.post(
        "/bids",
        {
          projectId: Number(id),
          proposal: bidForm.proposal,
          bidAmount: Number(bidForm.bidAmount),
          estimatedDays: Number(bidForm.estimatedDays),
        }
      );

      notify("Bid submitted successfully.");
      setBidForm({ proposal: "", bidAmount: "", estimatedDays: "" });
      fetchProject();
    } catch (error) {
      console.error("BID ERROR:", error);
      notify(error.response?.data?.message || "Bid failed", "error");
    }
  }

  async function acceptBid(bidId) {
    try {
      await API.put(`/bids/${bidId}/accept`, {});

      notify("Bid accepted.");
      fetchProject();
    } catch (error) {
      console.error("ACCEPT BID ERROR:", error);
      notify(error.response?.data?.message || "Failed to accept bid", "error");
    }
  }

  async function rejectBid(bidId) {
    try {
      await API.put(`/bids/${bidId}/reject`, {});
      notify("Bid rejected.");
      fetchProject();
    } catch (error) {
      notify(error.response?.data?.message || "Failed to reject bid", "error");
    }
  }

  async function deleteProject() {
    const confirmed = await confirmAction({
      title: "Delete project?",
      message: "This permanently removes the project, its bids, milestones, and reviews.",
      confirmLabel: "Delete project",
    });
    if (!confirmed) return;
    try {
      await API.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (error) {
      notify(error.response?.data?.message || "Failed to delete project", "error");
    }
  }

  async function completeProject() {
    try {
      await API.put(`/projects/${id}/complete`, {});
      notify("Project marked complete.");
      fetchProject();
    } catch (error) {
      notify(error.response?.data?.message || "Failed to complete project", "error");
    }
  }

  async function createMilestone(e) {
    e.preventDefault();

    try {
      await API.post(
        "/milestones",
        {
          projectId: Number(id),
          title: milestoneForm.title,
          description: milestoneForm.description,
          dueDate: milestoneForm.dueDate || null,
        }
      );

      notify("Milestone created.");
      setMilestoneForm({ title: "", description: "", dueDate: "" });
      fetchProject();
    } catch (error) {
      console.error("CREATE MILESTONE ERROR:", error);
      notify(error.response?.data?.message || "Failed to create milestone", "error");
    }
  }

  async function updateMilestoneStatus(milestoneId, status) {
    try {
      await API.put(`/milestones/${milestoneId}`, { status });

      notify(`Milestone updated to ${status.replace("_", " ")}.`);
      fetchProject();

    } catch (error) {
      console.error("UPDATE MILESTONE ERROR:", error);
      notify(error.response?.data?.message || "Failed to update milestone", "error");
    }
  }

  async function submitReview(e) {
    e.preventDefault();

    try {
      await API.post(
        "/reviews",
        {
          projectId: Number(id),
          rating: Number(review.rating),
          comment: review.comment,
        }
      );

      notify("Review submitted.");
      setReview({ rating: "", comment: "" });
      fetchProject();
    } catch (error) {
      console.error("REVIEW ERROR:", error);
      notify(error.response?.data?.message || "Review failed", "error");
    }
  }

  if (loading) {
    return <main className="page"><div className="loading-state">Loading project…</div></main>;
  }

  if (error) {
    return <main className="page"><div className="error-message" role="alert">{error}</div></main>;
  }

  const role = user?.role?.toUpperCase();
  const isProjectOwner = user?.id === project.clientId;
  const acceptedBid = project.bids?.find((bid) => bid.status === "ACCEPTED");
  const isAssignedFreelancer = acceptedBid?.freelancerId === user?.id;
  const hasReviewed = project.reviews?.some(
    (existingReview) => existingReview.reviewerId === user?.id
  );
  const canReview =
    project.status === "COMPLETED" &&
    (isProjectOwner || isAssignedFreelancer) &&
    !hasReviewed;

  const totalMilestones = project.milestones?.length || 0;

  const completedMilestones =
    project.milestones?.filter(
      (milestone) => milestone.status === "APPROVED"
    ).length || 0;

  const completionPercentage =
    totalMilestones === 0
      ? 0
      : Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <main className="page project-workspace">
      <section className="project-detail-hero">
        <div className="project-detail-copy">
          <div className="project-detail-labels">
            <span className="project-category">{project.category}</span>
            <span className={`status-badge status-${project.status.toLowerCase()}`}>
              {project.status.replace("_", " ")}
            </span>
          </div>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="project-detail-meta">
            <div><small>Budget</small><strong>${project.budgetMin}–${project.budgetMax}</strong></div>
            <div><small>Client</small><strong>{project.client?.name}</strong></div>
            <div><small>Milestones</small><strong>{completedMilestones}/{totalMilestones} approved</strong></div>
          </div>
        </div>
        {isProjectOwner && project.status === "OPEN" && <div className="project-actions">
          <Link className="button-link secondary" to={`/projects/${id}/edit`}>Edit project</Link>
          <button type="button" className="danger-button" onClick={deleteProject}>Delete</button>
        </div>}
      </section>

      <section className="progress-card">
        <div><strong>Project progress</strong><span>{completionPercentage}% complete</span></div>
        <progress className="progress-track" aria-label="Milestone completion" max="100" value={completionPercentage}>
          {completionPercentage}%
        </progress>
      </section>

      <div className="project-detail-grid">
        <div className="project-detail-main">
          <section className="workspace-section">
            <div className="section-heading-row">
              <div><p className="section-kicker">Proposals</p><h2>Bids</h2></div>
              <span className="count-chip">{project.bids?.length || 0}</span>
            </div>
            {project.bids?.length === 0 ? <div className="empty-state"><p>No bids yet.</p></div> : (
              <div className="workspace-list">
                {project.bids.map((bid) => (
                  <article key={bid.id} className="workspace-card">
                    <div className="card-heading-row">
                      <div className="person-label"><span>{bid.freelancer?.name?.charAt(0).toUpperCase()}</span><strong>{bid.freelancer?.name}</strong></div>
                      <span className={`status-badge status-${bid.status.toLowerCase()}`}>{bid.status}</span>
                    </div>
                    <p>{bid.proposal}</p>
                    <div className="project-meta">
                      <div><small>Bid amount</small><strong>${bid.bidAmount}</strong></div>
                      <div><small>Delivery</small><strong>{bid.estimatedDays} days</strong></div>
                    </div>
                    {isProjectOwner && bid.status === "PENDING" && (
                      <div className="project-actions">
                        <button onClick={() => acceptBid(bid.id)}>Accept bid</button>
                        <button className="secondary-button" onClick={() => rejectBid(bid.id)}>Reject</button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="workspace-section">
            <div className="section-heading-row">
              <div><p className="section-kicker">Delivery</p><h2>Milestones</h2></div>
              <span className="count-chip">{totalMilestones}</span>
            </div>
            {project.milestones?.length === 0 ? <div className="empty-state"><p>No milestones yet.</p></div> : (
              <div className="workspace-list">
                {project.milestones.map((milestone) => (
                  <article key={milestone.id} className="workspace-card milestone-card">
                    <div className="card-heading-row">
                      <h3>{milestone.title}</h3>
                      <span className={`status-badge status-${milestone.status.toLowerCase()}`}>{milestone.status.replace("_", " ")}</span>
                    </div>
                    <p>{milestone.description}</p>
                    {milestone.dueDate && <small className="due-date">Due {new Date(milestone.dueDate).toLocaleDateString()}</small>}
                    {isAssignedFreelancer && milestone.status === "TODO" && <button onClick={() => updateMilestoneStatus(milestone.id, "IN_PROGRESS")}>Start milestone</button>}
                    {isAssignedFreelancer && milestone.status === "IN_PROGRESS" && <button onClick={() => updateMilestoneStatus(milestone.id, "SUBMITTED")}>Submit milestone</button>}
                    {isProjectOwner && milestone.status === "SUBMITTED" && <button onClick={() => updateMilestoneStatus(milestone.id, "APPROVED")}>Approve milestone</button>}
                  </article>
                ))}
              </div>
            )}
            {isProjectOwner && project.status === "IN_PROGRESS" && totalMilestones > 0 && completedMilestones === totalMilestones && (
              <button className="complete-project-button" onClick={completeProject}>Mark project complete</button>
            )}
          </section>

          <section className="workspace-section">
            <div className="section-heading-row"><div><p className="section-kicker">Reputation</p><h2>Reviews</h2></div><span className="count-chip">{reviews.length}</span></div>
            {reviews.length === 0 ? <div className="empty-state"><p>No reviews yet.</p></div> : reviews.map((item) => (
              <article key={item.id} className="workspace-card review-card">
                <div className="card-heading-row"><strong>{item.reviewer.name}</strong><span className="rating-chip">★ {item.rating}/5</span></div>
                {item.comment && <p>{item.comment}</p>}
              </article>
            ))}
          </section>
        </div>

        <aside className="project-detail-sidebar">
          {role === "FREELANCER" && project.status === "OPEN" && (
            <section className="workspace-form-card">
              <p className="section-kicker">Interested?</p><h2>Submit a bid</h2>
              <form className="compact-form" onSubmit={handleBidSubmit}>
                <div className="form-field"><label htmlFor="bid-proposal">Proposal</label><textarea id="bid-proposal" name="proposal" placeholder="Explain how you will approach the work" value={bidForm.proposal} onChange={handleChange} required /></div>
                <div className="form-row">
                  <div className="form-field"><label htmlFor="bid-amount">Bid amount</label><input id="bid-amount" name="bidAmount" type="number" placeholder="$0" value={bidForm.bidAmount} onChange={handleChange} required min="1" /></div>
                  <div className="form-field"><label htmlFor="bid-days">Days</label><input id="bid-days" name="estimatedDays" type="number" placeholder="0" value={bidForm.estimatedDays} onChange={handleChange} required min="1" /></div>
                </div>
                <button>Submit bid</button>
              </form>
            </section>
          )}

          {isProjectOwner && project.status === "IN_PROGRESS" && (
            <section className="workspace-form-card">
              <p className="section-kicker">Plan delivery</p><h2>Create milestone</h2>
              <form className="compact-form" onSubmit={createMilestone}>
                <div className="form-field"><label htmlFor="milestone-title">Title</label><input id="milestone-title" name="title" placeholder="Milestone title" value={milestoneForm.title} onChange={handleMilestoneChange} required /></div>
                <div className="form-field"><label htmlFor="milestone-description">Description</label><textarea id="milestone-description" name="description" placeholder="Define the deliverable" value={milestoneForm.description} onChange={handleMilestoneChange} required /></div>
                <div className="form-field"><label htmlFor="milestone-due-date">Due date</label><input id="milestone-due-date" type="date" name="dueDate" value={milestoneForm.dueDate} onChange={handleMilestoneChange} required /></div>
                <button>Create milestone</button>
              </form>
            </section>
          )}

          {canReview && (
            <section className="workspace-form-card">
              <p className="section-kicker">Share feedback</p><h2>Leave a review</h2>
              <form className="compact-form" onSubmit={submitReview}>
                <div className="form-field"><label htmlFor="review-rating">Rating from 1 to 5</label><input id="review-rating" type="number" min="1" max="5" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })} required /></div>
                <div className="form-field"><label htmlFor="review-comment">Comment <span className="optional-label">(optional)</span></label><textarea id="review-comment" placeholder="Share your experience" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} /></div>
                <button>Submit review</button>
              </form>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
