import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFeedback } from "../context/FeedbackContext";
import PageHeader from "../components/PageHeader";

export default function NewProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useFeedback();
  const [submitting, setSubmitting] = useState(false);

  const role = user?.role?.toUpperCase();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    category: "",
  });

  if (role !== "CLIENT" && role !== "ADMIN") {
    return (
      <div className="page">
        <div className="card">
          <p>Only clients can post projects.</p>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (Number(form.budgetMax) < Number(form.budgetMin)) {
        notify("Maximum budget must be at least the minimum budget.", "error");
        return;
      }
      setSubmitting(true);
      await API.post(
        "/projects",
        {
          ...form,
          budgetMin: Number(form.budgetMin),
          budgetMax: Number(form.budgetMax),
        }
      );

      notify("Project created successfully.");
      navigate("/projects");
    } catch (error) {
      notify(error.response?.data?.message || "Project creation failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="editor-page">
      <div className="editor-shell">
        <PageHeader
          eyebrow="New opportunity"
          title="Post a project"
          description="Give freelancers the context they need to send focused, realistic proposals."
        />

        <form className="editor-form" onSubmit={handleSubmit}>
          <div className="editor-section">
            <div className="editor-section-heading">
              <span>01</span>
              <div><h2>Project brief</h2><p>Describe the outcome and the skills involved.</p></div>
            </div>
            <div className="form-field">
              <label htmlFor="project-title">Project title</label>
              <input id="project-title" name="title" placeholder="e.g. Redesign our customer dashboard" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="project-description">Description</label>
              <textarea id="project-description" name="description" placeholder="Describe the work, deliverables, and what success looks like" value={form.description} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="project-category">Category</label>
              <input id="project-category" name="category" placeholder="e.g. Web development" value={form.category} onChange={handleChange} required />
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-heading">
              <span>02</span>
              <div><h2>Budget</h2><p>Set a range that reflects the scope of work.</p></div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="project-budget-min">Minimum budget</label>
                <input id="project-budget-min" name="budgetMin" type="number" placeholder="$0" value={form.budgetMin} onChange={handleChange} required min="0" />
              </div>
              <div className="form-field">
                <label htmlFor="project-budget-max">Maximum budget</label>
                <input id="project-budget-max" name="budgetMax" type="number" placeholder="$0" value={form.budgetMax} onChange={handleChange} required min="0" />
              </div>
            </div>
          </div>

          <div className="editor-actions">
            <button disabled={submitting}>{submitting ? "Creating project…" : "Publish project"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
