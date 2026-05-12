import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [project, setProject] = useState(null);

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
      const res = await axios.get(`http://localhost:5001/api/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error("PROJECT DETAILS ERROR:", error);
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
      await axios.post(
        "http://localhost:5001/api/bids",
        {
          projectId: Number(id),
          proposal: bidForm.proposal,
          bidAmount: Number(bidForm.bidAmount),
          estimatedDays: Number(bidForm.estimatedDays),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Bid submitted successfully!");
      setBidForm({ proposal: "", bidAmount: "", estimatedDays: "" });
      fetchProject();
    } catch (error) {
      console.error("BID ERROR:", error);
      alert(error.response?.data?.message || "Bid failed");
    }
  }

  async function acceptBid(bidId) {
    try {
      await axios.put(
        `http://localhost:5001/api/bids/${bidId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Bid accepted!");
      fetchProject();
    } catch (error) {
      console.error("ACCEPT BID ERROR:", error);
      alert(error.response?.data?.message || "Failed to accept bid");
    }
  }

  async function createMilestone(e) {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5001/api/milestones",
        {
          projectId: Number(id),
          title: milestoneForm.title,
          description: milestoneForm.description,
          dueDate: milestoneForm.dueDate || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Milestone created!");
      setMilestoneForm({ title: "", description: "", dueDate: "" });
      fetchProject();
    } catch (error) {
      console.error("CREATE MILESTONE ERROR:", error);
      alert(error.response?.data?.message || "Failed to create milestone");
    }
  }

  async function submitMilestone(milestoneId) {
    try {
      await axios.put(
        `http://localhost:5001/api/milestones/${milestoneId}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Milestone submitted!");
      fetchProject();
    } catch (error) {
      console.error("SUBMIT MILESTONE ERROR:", error);
      alert(error.response?.data?.message || "Failed to submit milestone");
    }
  }

  async function approveMilestone(milestoneId) {
    try {
      await axios.put(
        `http://localhost:5001/api/milestones/${milestoneId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Milestone approved!");
      fetchProject();
    } catch (error) {
      console.error("APPROVE MILESTONE ERROR:", error);
      alert(error.response?.data?.message || "Failed to approve milestone");
    }
  }

  async function submitReview(e) {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5001/api/reviews",
        {
          projectId: Number(id),
          rating: Number(review.rating),
          comment: review.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review submitted!");
      setReview({ rating: "", comment: "" });
      fetchProject();
    } catch (error) {
      console.error("REVIEW ERROR:", error);
      alert(error.response?.data?.message || "Review failed");
    }
  }

  if (!project) {
    return <p style={{ padding: "20px" }}>Loading project...</p>;
  }

  const role = user?.role?.toUpperCase();
  const isProjectOwner = user?.id === project.clientId;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h1>{project.title}</h1>

      <p>{project.description}</p>

      <p><strong>Budget:</strong> ${project.budgetMin} - ${project.budgetMax}</p>
      <p><strong>Category:</strong> {project.category}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Client:</strong> {project.client?.name}</p>

      <hr />

      <h2>Bids</h2>

      {project.bids?.length === 0 ? (
        <p>No bids yet.</p>
      ) : (
        project.bids.map((bid) => (
          <div key={bid.id} style={styles.card}>
            <p>{bid.proposal}</p>
            <p><strong>Amount:</strong> ${bid.bidAmount}</p>
            <p><strong>Estimated Days:</strong> {bid.estimatedDays}</p>
            <p><strong>Status:</strong> {bid.status}</p>
            <p><strong>Freelancer:</strong> {bid.freelancer?.name}</p>

            {isProjectOwner && bid.status === "PENDING" && (
              <button onClick={() => acceptBid(bid.id)} style={styles.acceptButton}>
                Accept Bid
              </button>
            )}
          </div>
        ))
      )}

      {role === "FREELANCER" && project.status === "OPEN" && (
        <>
          <hr />
          <h2>Submit a Bid</h2>

          <form onSubmit={handleBidSubmit}>
            <textarea
              name="proposal"
              placeholder="Write your proposal"
              value={bidForm.proposal}
              onChange={handleChange}
              required
              style={styles.textarea}
            />

            <input
              name="bidAmount"
              type="number"
              placeholder="Bid amount"
              value={bidForm.bidAmount}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="estimatedDays"
              type="number"
              placeholder="Estimated days"
              value={bidForm.estimatedDays}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button style={styles.button}>Submit Bid</button>
          </form>
        </>
      )}

      <hr />

      <h2>Milestones</h2>

      {project.milestones?.length === 0 ? (
        <p>No milestones yet.</p>
      ) : (
        project.milestones.map((milestone) => (
          <div key={milestone.id} style={styles.card}>
            <p><strong>{milestone.title}</strong></p>
            <p>{milestone.description}</p>
            <p><strong>Status:</strong> {milestone.status}</p>

            {milestone.dueDate && (
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(milestone.dueDate).toLocaleDateString()}
              </p>
            )}

            {role === "FREELANCER" && milestone.status === "TODO" && (
              <button onClick={() => submitMilestone(milestone.id)} style={styles.button}>
                Submit Milestone
              </button>
            )}

            {isProjectOwner && milestone.status === "SUBMITTED" && (
              <button onClick={() => approveMilestone(milestone.id)} style={styles.acceptButton}>
                Approve Milestone
              </button>
            )}
          </div>
        ))
      )}

      {isProjectOwner && project.status === "IN_PROGRESS" && (
        <>
          <hr />
          <h2>Create Milestone</h2>

          <form onSubmit={createMilestone}>
            <input
              name="title"
              placeholder="Milestone title"
              value={milestoneForm.title}
              onChange={handleMilestoneChange}
              required
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="Milestone description"
              value={milestoneForm.description}
              onChange={handleMilestoneChange}
              style={styles.textarea}
            />

            <input
              type="date"
              name="dueDate"
              value={milestoneForm.dueDate}
              onChange={handleMilestoneChange}
              style={styles.input}
            />

            <button style={styles.button}>Create Milestone</button>
          </form>
        </>
      )}

      {isProjectOwner && project.status === "COMPLETED" && (
        <>
          <hr />
          <h2>Leave a Review</h2>

          <form onSubmit={submitReview}>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rating (1-5)"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
              required
              style={styles.input}
            />

            <textarea
              placeholder="Comment"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              style={styles.textarea}
            />

            <button style={styles.button}>Submit Review</button>
          </form>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    fontSize: "16px",
    minHeight: "120px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  acceptButton: {
    padding: "10px 16px",
    cursor: "pointer",
    marginTop: "10px",
  },
};