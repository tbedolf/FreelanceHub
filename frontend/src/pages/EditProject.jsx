import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { useFeedback } from "../context/FeedbackContext";
import PageHeader from "../components/PageHeader";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useFeedback();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/projects/${id}`).then(({ data }) => setForm({
      title: data.title, description: data.description, category: data.category,
      budgetMin: data.budgetMin, budgetMax: data.budgetMax,
    })).catch((e) => setError(e.response?.data?.message || "Failed to load project"));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (Number(form.budgetMax) < Number(form.budgetMin)) {
        setError("Maximum budget must be at least the minimum budget.");
        return;
      }
      setSubmitting(true);
      await API.put(`/projects/${id}`, form);
      notify("Project updated successfully.");
      navigate(`/projects/${id}`);
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!form) return <main className="page"><div className={error ? "error-message" : "loading-state"}>{error || "Loading project…"}</div></main>;
  return <main className="editor-page"><div className="editor-shell">
    <PageHeader eyebrow="Project settings" title="Edit project" description="Keep the scope, category, and budget accurate for everyone involved." />
    <form className="editor-form" onSubmit={submit}>
      <div className="editor-section">
        <div className="form-field"><label htmlFor="edit-title">Project title</label><input id="edit-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-field"><label htmlFor="edit-description">Description</label><textarea id="edit-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
        <div className="form-field"><label htmlFor="edit-category">Category</label><input id="edit-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="edit-budget-min">Minimum budget</label><input id="edit-budget-min" type="number" min="0" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} required /></div>
          <div className="form-field"><label htmlFor="edit-budget-max">Maximum budget</label><input id="edit-budget-max" type="number" min="0" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} required /></div>
        </div>
      </div>
      {error && <div className="error-message" role="alert">{error}</div>}
      <div className="editor-actions"><button disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button></div>
    </form>
  </div></main>;
}
